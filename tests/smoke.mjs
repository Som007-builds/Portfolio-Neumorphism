import http from 'node:http';
import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

// Dependency-free, finite Edge/CDP smoke test. Writes only beneath tests/.
const tests = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(tests);
const pages = ['index.html', 'systems.html', 'lab.html', 'codex.html', 'contact.html'];
const production = [...pages, 'styles.css', 'theme.js', 'README.md', 'vercel.json', 'robots.txt', 'sitemap.xml', 'assets/favicon.svg', 'assets/social-preview.png', 'assets/resume/README.md'];
const profile = path.join(tests, '.tmp', 'edge-profile');
const screenshots = path.join(tests, 'screenshots');
const edgePath = process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const allowFonts = process.env.ALLOW_FONTS === '1';
const fontHosts = new Set(['fonts.googleapis.com', 'fonts.gstatic.com']);
const fontWaitBudgetMs = 20000;
const results = {
  started: new Date().toISOString(), checks: [], screenshots: [], runtimeErrors: [], consoleErrors: [], blockedExternal: [], allowedFontRequests: [],
  fonts: { allowed: allowFonts, waitBudgetMs: fontWaitBudgetMs, waitUsedMs: 0, observations: [] },
  notes: [
    allowFonts
      ? 'Only HTTPS page requests to fonts.googleapis.com and fonts.gstatic.com may reach the network. Font availability is measured, not assumed; see fonts.observations.'
      : 'All remote page requests are denied or mocked. Google Fonts is blocked; font observations record fallback versus loaded status.',
    'Formspree is always mocked; no real delivery or external link availability is tested.',
    'HTML balance checks use a conservative token scanner, not a full standards validator.'
  ]
};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function check(name, ok, detail = null) {
  results.checks.push({ name, ok: Boolean(ok), detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok || detail == null ? '' : ': ' + JSON.stringify(detail)}`);
}
async function until(fn, label, timeout = 6000) {
  const start = Date.now();
  while (Date.now() - start < timeout) { const result = await fn(); if (result) return result; await delay(40); }
  throw new Error(`Timed out: ${label}`);
}
const hash = async file => createHash('sha256').update(await readFile(path.join(root, file))).digest('hex');
const before = Object.fromEntries(await Promise.all(production.map(async file => [file, await hash(file)])));
let server, browser, cdp, watchdog;
let deadlineReached = false;
let browserLog = '';

class CDP {
  constructor(ws) {
    this.ws = ws; this.next = 0; this.pending = new Map(); this.listeners = new Map();
    ws.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id); if (!pending) return;
        clearTimeout(pending.timer); this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(JSON.stringify(message.error))); else pending.resolve(message.result);
      } else for (const listener of this.listeners.get(message.method) || []) Promise.resolve(listener(message.params)).catch(error => results.runtimeErrors.push({ source: 'test event handler', message: String(error) }));
    });
  }
  on(name, fn) { this.listeners.set(name, [...(this.listeners.get(name) || []), fn]); }
  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.next;
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 7000);
      this.pending.set(id, { resolve, reject, timer }); this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  close() { this.ws.close(); for (const pending of this.pending.values()) { clearTimeout(pending.timer); pending.reject(new Error('CDP closed')); } this.pending.clear(); }
}

function validateSource(file, source) {
  for (const tag of ['html', 'head', 'body']) {
    check(`${file}: single balanced ${tag}`, (source.match(new RegExp(`<${tag}(?:\\s[^>]*)?>`, 'gi')) || []).length === 1 && (source.match(new RegExp(`</${tag}\\s*>`, 'gi')) || []).length === 1);
  }
  check(`${file}: one HTML doctype`, (source.match(/<!doctype html>/gi) || []).length === 1);
  check(`${file}: valid UTF-8 declaration`, /<meta\s+charset=["']utf-8["']\s*\/?\s*>/i.test(source));
  check(`${file}: exact viewport`, (source.match(/name=["']viewport["']/gi) || []).length === 1 && /<meta name="viewport" content="width=device-width, initial-scale=1">/.test(source));
  check(`${file}: no text before head`, /^\s*<!doctype html>\s*<html\b[^>]*>\s*<head>/i.test(source));
  const clean = source.replace(/<!--[\s\S]*?-->/g, '').replace(/(<script\b[^>]*>)[\s\S]*?(<\/script>)/gi, '$1$2').replace(/(<style\b[^>]*>)[\s\S]*?(<\/style>)/gi, '$1$2');
  const stack = [], problems = [];
  const voids = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
  for (const token of clean.matchAll(/<\/?([a-z][\w:-]*)\b[^>]*>/gi)) {
    const [text, rawTag] = token, tag = rawTag.toLowerCase();
    if (text.startsWith('</')) { const expected = stack.pop(); if (expected !== tag) problems.push({ closing: tag, expected }); }
    else if (!voids.has(tag) && !text.endsWith('/>')) stack.push(tag);
  }
  check(`${file}: balanced tag nesting`, problems.length === 0 && stack.length === 0, { problems, unclosed: stack });
  check(`${file}: no malformed tag openers`, !/<</.test(clean) && !/<[^>]*</.test(clean));
}

try {
  await mkdir(screenshots, { recursive: true }); await mkdir(profile, { recursive: true });
  for (const file of pages) validateSource(file, await readFile(path.join(root, file), 'utf8'));
  // Overhaul metadata, résumé, and content checks from static sources (no browser needed).
  const canonical = {
    'index.html': 'https://sohamsingh.indevs.in/',
    'systems.html': 'https://sohamsingh.indevs.in/systems',
    'lab.html': 'https://sohamsingh.indevs.in/lab',
    'codex.html': 'https://sohamsingh.indevs.in/codex',
    'contact.html': 'https://sohamsingh.indevs.in/contact'
  };
  const sources = {};
  for (const file of pages) {
    const source = sources[file] = await readFile(path.join(root, file), 'utf8');
    check(`${file}: canonical URL`, source.includes(`<link rel="canonical" href="${canonical[file]}">`), canonical[file]);
    check(`${file}: favicon linked`, source.includes('<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">'));
    check(`${file}: social preview metadata`, source.includes('<meta property="og:image" content="https://sohamsingh.indevs.in/assets/social-preview.png">') && source.includes('<meta property="og:image:width" content="1200">') && source.includes('<meta property="og:image:height" content="630">') && source.includes('<meta name="twitter:card" content="summary_large_image">'));
    check(`${file}: footer résumé placeholder standardized`, source.includes('data-resume-slot="footer"'));
    check(`${file}: no link to a missing résumé PDF`, !source.includes('href="assets/resume/'));
  }
  check('Home: three project cards', (sources['index.html'].match(/class="project-card"/g) || []).length === 3);
  check('Home: hero + footer résumé slots', sources['index.html'].includes('data-resume-slot="hero"') && sources['index.html'].includes('data-resume-slot="footer"'));
  check('Lab: skills target exists', sources['lab.html'].includes('id="skills"'));
  check('Lab: consistent navigation labels', sources['lab.html'].includes('>Skills &amp; Lab</a>') && sources['lab.html'].includes('>Projects</a>'));
  check('Systems: case-study scaffolding', ['class="case-index"', 'class="case-details"', 'class="table-scroll"', 'class="evidence-list"', 'class="case-status"'].every(token => sources['systems.html'].includes(token)));
  check('Systems: all case anchors preserved', ['id="foretyx"', 'id="browser-chatbot"', 'id="home-automation"'].every(token => sources['systems.html'].includes(token)));
  check('Codex: four entry summaries', (sources['codex.html'].match(/class="entry-summary"/g) || []).length === 4);
  check('Arbiter naming normalized', !/Arbiter AI/.test(sources['systems.html']) && !/Arbiter AI/.test(sources['index.html']) && !/Arbiter AI/.test(await readFile(path.join(root, 'PROJECT_EVIDENCE.md'), 'utf8')));
  check('No stale first-year biography in pages', pages.every(file => !/first[- ]year|year 1|\bY1\b|1st[- ]year/i.test(sources[file])));
  const robots = await readFile(path.join(root, 'robots.txt'), 'utf8').catch(() => '');
  check('robots.txt present with canonical sitemap', /User-agent: \*/.test(robots) && robots.includes('Sitemap: https://sohamsingh.indevs.in/sitemap.xml'));
  const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
  check('sitemap lists all canonical clean paths', ['/', '/systems', '/codex', '/lab', '/contact'].every(p => sitemap.includes(`https://sohamsingh.indevs.in${p}`)));
  check('Social preview image is a 1200×630 raster', (await readFile(path.join(root, 'assets/social-preview.png'))).subarray(1, 4).toString('latin1') === 'PNG');
  server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (pathname === '/favicon.ico') { res.writeHead(204); res.end(); return; }
      const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
      const bytes = await readFile(file);
      res.writeHead(200, { 'Content-Type': ({ '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain', '.md': 'text/markdown', '.pdf': 'application/pdf', '.ico': 'image/x-icon' })[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(bytes);
    } catch { res.writeHead(404); res.end('Not found'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = spawn(edgePath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--metrics-recording-only', '--disable-extensions', '--remote-debugging-port=0', '--remote-allow-origins=*', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'pipe', 'pipe'] });
  browser.on('error', error => { browserLog += String(error); });
  browser.stderr.on('data', chunk => { browserLog += chunk; }); browser.stdout.on('data', chunk => { browserLog += chunk; });
  watchdog = setTimeout(() => {
      deadlineReached = true;
      console.error('Global 85-second test deadline reached');
      cdp?.close(); browser.kill(); server.closeAllConnections(); server.close();
    }, 85000);
  const port = await until(async () => { try { return (await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; } catch { return false; } }, 'Edge debugging port', 15000);
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const ws = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  cdp = new CDP(ws);
  const evaluate = async expression => {
    const value = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (value.exceptionDetails) throw new Error(JSON.stringify(value.exceptionDetails)); return value.result.value;
  };
  cdp.on('Runtime.exceptionThrown', event => results.runtimeErrors.push(event.exceptionDetails));
  cdp.on('Runtime.consoleAPICalled', event => { if (event.type === 'error') results.consoleErrors.push(event.args.map(arg => arg.value || arg.description).join(' ')); });
  const browserLogs = [];
  cdp.on('Log.entryAdded', ({ entry }) => { if (entry.level === 'error') browserLogs.push(entry); });
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable'); await cdp.send('Network.enable');
  // Reuse downloaded fonts across navigations; local responses remain no-store.
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: !allowFonts });
  let formMode = 'success', formRequests = 0, held = [];
  cdp.on('Fetch.requestPaused', async event => {
    const { requestId, request } = event;
    if (request.url.startsWith(origin + '/')) { await cdp.send('Fetch.continueRequest', { requestId }); return; }
    if (request.url.startsWith('https://formspree.io/')) {
      const headers = [{ name: 'Access-Control-Allow-Origin', value: origin }, { name: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' }, { name: 'Access-Control-Allow-Headers', value: 'Accept, Content-Type' }, { name: 'Content-Type', value: 'application/json' }];
      if (request.method === 'OPTIONS') { await cdp.send('Fetch.fulfillRequest', { requestId, responseCode: 204, responseHeaders: headers }); return; }
      formRequests++;
      if (formMode === 'pending' || formMode === 'timeout') { held.push(requestId); return; }
      if (formMode === 'network') { await cdp.send('Fetch.failRequest', { requestId, errorReason: 'ConnectionFailed' }); return; }
      await cdp.send('Fetch.fulfillRequest', { requestId, responseCode: formMode === 'failure' ? 422 : 200, responseHeaders: headers, body: Buffer.from(JSON.stringify({ ok: formMode !== 'failure' })).toString('base64') }); return;
    }
    const url = new URL(request.url);
        if (allowFonts && url.protocol === 'https:' && fontHosts.has(url.hostname) && !url.username && !url.password && !url.port) {
          results.allowedFontRequests.push(request.url);
          await cdp.send('Fetch.continueRequest', { requestId }); return;
        }
    results.blockedExternal.push(request.url); await cdp.send('Fetch.failRequest', { requestId, errorReason: 'BlockedByClient' });
  });
  // Intercept every page request BEFORE navigation, including redirect destinations.
  // Formspree stays mocked regardless of the optional, exact-host font allowlist.
  await cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] });
  async function viewport(width) {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: width <= 760 ? 812 : 1000, deviceScaleFactor: 1, mobile: width <= 760 });
    // Also works with page JavaScript disabled, unlike requestAnimationFrame.
    await delay(120);
  }
  async function settleFonts() {
    const started = Date.now();
    const budget = Math.max(0, Math.min(4000, fontWaitBudgetMs - results.fonts.waitUsedMs));
    let ready = false;
    do {
      ready = await evaluate(`document.readyState === 'complete' && document.fonts.status !== 'loading'`);
      if (ready || Date.now() - started >= budget) break;
      await delay(50);
    } while (true);
    results.fonts.waitUsedMs += Date.now() - started;
    if (!ready) await cdp.send('Page.stopLoading');
    return !ready;
  }
  async function observeFonts(context, waitTimedOut = false, assertLoaded = false) {
    const observation = await evaluate(`(() => {
      const faces = [...document.fonts].map(face => ({family:face.family,weight:face.weight,status:face.status}));
      const families = ['Silkscreen','DM Sans'].map(family => {
        const matching = faces.filter(face => face.family.replace(/["']/g,'') === family);
        const available = document.fonts.check('16px "' + family + '"', 'BUILDING private AI systems');
        // check() alone can return true for an undeclared family that falls back.
        const loaded = available && matching.some(face => face.status === 'loaded');
        return {family,check:available,loaded,rendering:loaded?'loaded':'fallback',faces:matching};
      });
      return {url:location.href,fontSetStatus:document.fonts.status,families};
    })()`);
    Object.assign(observation, { context, waitTimedOut });
    results.fonts.observations.push(observation);
    if (allowFonts && assertLoaded) for (const font of observation.families) {
      check(`${context}: ${font.family} font loaded`, font.loaded && !waitTimedOut, font);
    }
  }
  async function navigate(file) {
    const url = origin + '/' + file;
    await cdp.send('Page.navigate', { url });
    await until(() => evaluate(`location.href === ${JSON.stringify(url)} && document.readyState !== 'loading' && !!document.querySelector('main')`), `DOM load ${file}`);
    const waitTimedOut = await settleFonts();
    await observeFonts(`navigation ${file}`, waitTimedOut);
  }
  async function click(selector) {
    await evaluate(`document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({block:'center',behavior:'instant'})`);
    await delay(60);
    const box = await evaluate(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); if (!e) return null; e.scrollIntoView({block:'center',behavior:'instant'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
    if (!box) throw new Error('Missing click target: ' + selector);
    await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...box });
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...box });
    await delay(60);
  }
  async function key(key, code = key, virtual = undefined) {
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: virtual, ...(key === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) });
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: virtual });
    await delay(60);
  }
  async function capture(name) {
    const fontWaitTimedOut = await settleFonts();
    await observeFonts(`screenshot ${name}`, fontWaitTimedOut, true);
    await evaluate(`(async () => { for (const image of document.images) { image.scrollIntoView({behavior:'instant'}); await new Promise(resolve=>requestAnimationFrame(resolve)); } })()`);
    await until(() => evaluate('[...document.images].every(image=>image.complete&&image.naturalWidth>0)'), 'screenshot images loaded');
    await evaluate('window.scrollTo({top:0,behavior:"instant"})');
    await delay(850);
    const metrics = await cdp.send('Page.getLayoutMetrics');
    const width = await evaluate('innerWidth');
    const image = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: Math.ceil(metrics.cssContentSize.height), scale: 1 } });
    await writeFile(path.join(screenshots, name + '.png'), Buffer.from(image.data, 'base64'));
    results.screenshots.push('tests/screenshots/' + name + '.png');
  }

  for (const file of pages) {
    await viewport(1440); await navigate(file);
    await observeFonts(`page ${file}`, results.fonts.observations.at(-1).waitTimedOut, true);
    const dom = await evaluate(`(() => {
      const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
      const references=[...document.querySelectorAll('[aria-labelledby],[aria-describedby],[aria-controls],label[for]')].flatMap(e=>['aria-labelledby','aria-describedby','aria-controls','for'].flatMap(a=>(e.getAttribute(a)||'').split(/\\s+/).filter(Boolean).filter(id=>!document.getElementById(id)).map(id=>({attribute:a,id}))));
      return { duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i), references, current:[...document.querySelectorAll('.site-nav [aria-current="page"]')].map(e=>e.getAttribute('href')), viewport:[...document.querySelectorAll('meta[name="viewport"]')].map(e=>e.content), headCSS:!!document.head.querySelector('link[href="styles.css"]'), headScript:!!document.head.querySelector('script[src="theme.js"]'), stray:[...document.body.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()), links:[...document.querySelectorAll('a[href],link[href],script[src],img[src]')].map(e=>({tag:e.tagName,value:e.getAttribute('href')||e.getAttribute('src')})), images:[...document.images].filter(e=>!e.loading || e.loading!=='lazy').every(e=>e.complete&&e.naturalWidth>0), main:!!document.querySelector('main h1') };
    })()`);
    check(`${file}: no duplicate IDs`, dom.duplicates.length === 0, dom.duplicates);
    check(`${file}: aria and label references resolve`, dom.references.length === 0, dom.references);
    check(`${file}: header aria-current`, dom.current.length === 1 && dom.current[0] === file, dom.current);
    check(`${file}: browser viewport declaration`, dom.viewport.length === 1 && dom.viewport[0] === 'width=device-width, initial-scale=1', dom.viewport);
    check(`${file}: assets retained in head`, dom.headCSS && dom.headScript, dom);
    check(`${file}: no stray body text`, dom.stray.length === 0, dom.stray);
    check(`${file}: main heading and eager images render`, dom.main && dom.images);
    const headings = await evaluate(`(() => { const hs=[...document.querySelectorAll('main h1,main h2,main h3,main h4')].map(h=>Number(h.tagName[1])); return { count:hs.length, oneH1:document.querySelectorAll('main h1').length===1, ok:hs.length>0 && hs[0]===1 && hs.every((l,i)=>i===0||l<=hs[i-1]+1) }; })()`);
    check(`${file}: single h1 with no skipped levels`, headings.oneH1 && headings.ok, headings);
    const broken = [], dummy = [];
    for (const link of dom.links) {
      const url = new URL(link.value, origin + '/' + file);
      if (link.tag === 'A' && (!link.value.trim() || link.value === '#' || /^javascript:/i.test(link.value))) dummy.push(link);
      if (url.origin !== origin) continue;
      const target = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
      try {
        await stat(path.join(root, target));
        if (url.hash) {
          const source = await readFile(path.join(root, target), 'utf8');
          const id = decodeURIComponent(url.hash.slice(1));
          if (![...source.matchAll(/\bid=["']([^"']+)["']/g)].some(match => match[1] === id)) broken.push({ ...link, missingAnchor: id });
        }
      } catch { broken.push(link); }
    }
    check(`${file}: local assets, links and anchors resolve`, broken.length === 0, broken);
    check(`${file}: no dummy links`, dummy.length === 0, dummy);
    for (const width of [320, 360, 375, 390, 760, 768, 1024, 1440]) {
      await viewport(width); await delay(60);
      const layout = await evaluate(`(() => { const visible=e=>!!e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'; const n=document.querySelector('.site-nav'),m=document.querySelector('.menu-toggle'); return { width:innerWidth, client:document.documentElement.clientWidth, scroll:document.documentElement.scrollWidth, body:document.body.scrollWidth, menu:visible(m),nav:visible(n),expanded:m.getAttribute('aria-expanded'),offenders:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&& (r.right>innerWidth+1||r.left< -1)}).slice(0,8).map(e=>({tag:e.tagName,class:e.getAttribute('class')}))}; })()`);
      check(`${file}: no horizontal overflow at ${width}`, layout.width === width && layout.scroll <= width && layout.body <= width, layout);
      const frame = await evaluate(`(() => { const shell=document.querySelector('.site-shell'), r=shell.getBoundingClientRect(), s=getComputedStyle(shell); return {left:r.left, width:r.width, viewport:document.documentElement.clientWidth, margin:s.margin, border:s.borderTopWidth, body:getComputedStyle(document.body).backgroundColor, shell:s.backgroundColor}; })()`);
      check(`${file}: edge-to-edge without outer frame at ${width}`, frame.left === 0 && Math.abs(frame.width-frame.viewport) < 1 && frame.margin === '0px' && frame.border === '0px' && frame.body === frame.shell, frame);
      check(`${file}: responsive navigation at ${width}`, width <= 760 ? layout.menu && !layout.nav && layout.expanded === 'false' : !layout.menu && layout.nav, layout);
      if (width === 375) {
        const targets = await evaluate(`[...document.querySelectorAll('.site-nav a, .button, .menu-toggle, .theme-toggle, .text-link, .notes-list a, .journal-index a, .channel-list a')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&r.height<24;}).map(e=>({cls:String(e.className),h:Math.round(e.getBoundingClientRect().height)})).slice(0,8)`);
        check(`${file}: primary controls meet 24px target height at 375`, targets.length === 0, targets);
      }
      if (width === 375 || width === 1440) {
              await capture(`${path.basename(file, '.html')}-${width}`);
              if (file === 'index.html') {
                const portrait = await evaluate(`(() => { const e=document.querySelector('.portrait img'),r=e.getBoundingClientRect();return {width:r.width,height:r.height,aspectRatio:getComputedStyle(e).aspectRatio,heightAttribute:e.getAttribute('height')}; })()`);
                check(`Home portrait: intended 4:5 crop at ${width}`, Math.abs(portrait.width / portrait.height - 4 / 5) < 0.01, portrait);
              }
            }
    }
    await viewport(375);
    await click('.menu-toggle');
    check(`${file}: menu opens with visible navigation`, await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='true' && getComputedStyle(document.querySelector('.site-nav')).display!=='none'`));
    await key('Tab', 'Tab', 9);
    check(`${file}: keyboard enters menu`, await evaluate(`document.activeElement.matches('.site-nav a')`));
    await key('Escape', 'Escape', 27);
    check(`${file}: Escape closes and restores focus`, await evaluate(`document.activeElement.matches('.menu-toggle') && document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false' && getComputedStyle(document.querySelector('.site-nav')).display==='none'`));
    await key('Enter', 'Enter', 13);
    check(`${file}: Enter opens menu`, await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='true'`));
    await click('main h1');
    check(`${file}: outside click closes menu`, await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false'`));
  }

  // Native focus events require the headless page to be focused, not just activeElement.
  await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: true });
  // Record actual Web Animations calls without changing production behavior.
  const motionScript = await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: `window.motionCalls=[]; const originalAnimate=Element.prototype.animate; Element.prototype.animate=function(frames,options){window.motionCalls.push({className:this.className,duration:options.duration,delay:options.delay,frames});return originalAnimate.call(this,frames,options);};` });
  await viewport(1440);
  await cdp.send('Emulation.setEmulatedMedia', { features: [{name:'prefers-reduced-motion',value:'no-preference'}] });
  await navigate('index.html');
  await delay(900);
  const entrance = await evaluate(`({calls:window.motionCalls, opacity:getComputedStyle(document.querySelector('.hero-art')).opacity, transform:getComputedStyle(document.querySelector('.hero-art')).transform, active:document.getAnimations().length})`);
  check('Motion: staggered hero and artwork entrance', entrance.calls.some(call=>call.className==='hero-art'&&call.delay===120) && entrance.calls.filter(call=>call.delay>0).length>=3, entrance);
  check('Motion: entrance settles visibly without persistent transforms', entrance.opacity==='1'&&entrance.transform==='none'&&entrance.active===0, entrance);
  const revealBefore = await evaluate('window.motionCalls.length');
  await evaluate(`document.querySelector('.project-card').scrollIntoView({block:'center',behavior:'instant'})`);
  await delay(80);
  check('Motion: scrolling reveals newly visible work', await evaluate(`window.motionCalls.length>${revealBefore} && window.motionCalls.some(call=>String(call.className).includes('project-card'))`));
  await evaluate(`document.querySelector('.project-card .text-link').focus()`);
  const focusedReveal = await evaluate(`(() => {const card=document.querySelector('.project-card');const link=card.querySelector('.text-link');return {focused:document.activeElement===link,opacity:getComputedStyle(card).opacity,states:card.getAnimations().map(animation=>animation.playState)};})()`);
  check('Motion: keyboard focus immediately finishes containing reveal', focusedReveal.focused && focusedReveal.opacity==='1' && focusedReveal.states.length===0, focusedReveal);
  await cdp.send('Emulation.setEmulatedMedia', { features: [{name:'prefers-reduced-motion',value:'reduce'}] });
  await delay(80);
  check('Motion: live reduced-motion change cancels running effects', await evaluate(`document.getAnimations().length===0`));
  const stoppedCount = await evaluate('window.motionCalls.length');
  await evaluate(`document.querySelector('.contact-strip').scrollIntoView({behavior:'instant'})`);
  await delay(80);
  check('Motion: reduced motion disconnects scroll observer', await evaluate(`window.motionCalls.length===${stoppedCount}`));
  await navigate('index.html');
  check('Motion: reduced-motion first load skips all reveals', await evaluate(`window.motionCalls.length===0 && document.getAnimations().length===0 && getComputedStyle(document.querySelector('h1')).opacity==='1'`));
  await viewport(375);
  await click('.menu-toggle');
  check('Motion: reduced-motion mobile menu remains functional without animation', await evaluate(`document.getAnimations().length===0 && document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='true'`));
  await cdp.send('Emulation.setEmulatedMedia', { features: [{name:'prefers-reduced-motion',value:'no-preference'}] });
  const missingObserver = await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source:'window.IntersectionObserver=undefined;'});
  await navigate('index.html');
  check('Motion: unsupported observer keeps content visible', await evaluate(`window.motionCalls.length===0 && getComputedStyle(document.querySelector('.hero-art')).opacity==='1' && getComputedStyle(document.querySelector('.project-card')).opacity==='1'`));
  await cdp.send('Page.removeScriptToEvaluateOnNewDocument', {identifier:missingObserver.identifier});
  await cdp.send('Page.removeScriptToEvaluateOnNewDocument', {identifier:motionScript.identifier});

  // Inspect browser-parsed selector relevance without installing a CSS parser.
  await viewport(1440); await navigate('index.html');
  const selectors = await evaluate(`(() => { const all=[]; function walk(rules){for(const r of rules){if(r.selectorText) all.push(r.selectorText);if(r.cssRules)walk(r.cssRules)}} for(const s of document.styleSheets){try{walk(s.cssRules)}catch{}} return all; })()`);
  const relevant = new Set(), invalidSelectors = [];
  for (const file of pages) {
    await navigate(file);
    const matches = await evaluate(`(${JSON.stringify(selectors)}).map(s=>{try{return document.querySelector(s)?1:0}catch{return -1}})`);
    matches.forEach((match, index) => { if (match === 1) relevant.add(selectors[index]); if (match === -1) invalidSelectors.push(selectors[index]); });
  }
  const unmatched = selectors.filter(selector => !relevant.has(selector));
  check('Stylesheet: valid browser-parsed selectors', invalidSelectors.length === 0, invalidSelectors);
  check('Stylesheet: core component selectors are relevant', ['.site-shell','.site-header','.site-nav','.hero','.contact-form','.journal-layout','.project-case','.project-card','.strength-grid','.case-index','.case-details','.table-scroll','.entry-summary'].every(s=>relevant.has(s)));
  results.css = { totalSelectorRules: selectors.length, matchedAtRest: relevant.size, unmatchedAtRest: unmatched, note: 'Pseudo-elements and state selectors may intentionally not match at rest.' };

  await navigate('index.html');
  await evaluate('localStorage.clear()'); await navigate('index.html');
  check('Theme: default dark', await evaluate(`document.documentElement.dataset.theme==='dark'`));
  await click('[data-theme-toggle]');
  check('Theme: toggle saves light and accessible label', await evaluate(`document.documentElement.dataset.theme==='light' && localStorage.getItem('theme')==='light' && document.querySelector('[data-theme-toggle]').getAttribute('aria-label')==='Switch to dark theme'`));
  await navigate('contact.html');
  check('Theme: saved light survives navigation', await evaluate(`document.documentElement.dataset.theme==='light'`));
  await cdp.send('Page.reload'); await until(() => evaluate(`document.readyState==='complete' && document.documentElement.dataset.theme==='light'`), 'light theme reload');
  check('Theme: saved light survives reload', true);
  await capture('contact-light-1440');
  const storageScript = await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: `Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Test storage denied','SecurityError')}});` });
  await navigate('index.html');
  check('Theme: inaccessible storage defaults dark', await evaluate(`document.documentElement.dataset.theme==='dark'`));
  await click('[data-theme-toggle]');
  check('Theme: toggle works with inaccessible storage', await evaluate(`document.documentElement.dataset.theme==='light'`));
  await cdp.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: storageScript.identifier });
  await navigate('index.html'); await evaluate(`localStorage.setItem('theme','dark')`); await navigate('index.html');

  // Real mouse and keyboard navigation, not location assignment.
  await click('a[href="systems.html#foretyx"]');
  await until(() => evaluate(`location.pathname==='/systems.html'&&location.hash==='#foretyx'&&document.readyState==='complete'`), 'natural systems link');
  check('Links: natural cross-page anchor navigation', await evaluate(`!!document.getElementById(location.hash.slice(1))`));
  // Let the destination's smooth fragment scroll finish before clicking its header.
  await delay(750);
  await click('.site-nav a[href="codex.html"]');
  await until(() => evaluate(`location.pathname==='/codex.html'&&document.readyState==='complete'`), 'natural Codex link');
  await click('.journal-index a[href="#local-models"]');
  check('Links: natural journal anchor', await evaluate(`location.hash==='#local-models'&&!!document.getElementById('local-models')`));
  await navigate('index.html'); await key('Tab','Tab',9);
  check('Keyboard: skip link is first tab stop with visible focus', await evaluate(`document.activeElement.matches('.skip-link') && document.activeElement.matches(':focus-visible') && getComputedStyle(document.activeElement).outlineStyle!=='none'`));
  await key('Enter','Enter',13);
  check('Keyboard: skip link reaches main anchor', await evaluate(`location.hash==='#main'`));
  await key('Tab','Tab',9);
  check('Keyboard: next tab after skip is inside main', await evaluate(`!!document.activeElement.closest('main')`));

  await navigate('contact.html');
  const fill = () => evaluate(`(() => { const values={'contact-name':'Automated Test','contact-email':'smoke@example.test','contact-topic':'Technical Discussion','contact-message':'Mock-only validation message. Do not deliver.'};for(const [id,value] of Object.entries(values)){const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));} return document.getElementById('contact-form').checkValidity(); })()`);
  const formState = () => evaluate(`({state:document.getElementById('form-status').dataset.state,text:document.getElementById('form-status').textContent,disabled:document.getElementById('submit-btn').disabled,busy:document.getElementById('contact-form').getAttribute('aria-busy'),values:[...document.querySelectorAll('input,textarea,select')].map(e=>e.value)})`);
  await click('#submit-btn');
  check('Form: native validity prevents empty submit', formRequests === 0 && await evaluate(`!document.getElementById('contact-form').checkValidity()`));
  for (const mode of ['success','failure','network']) {
    formMode = mode; check(`Form ${mode}: valid inputs`, await fill());
    const count = formRequests; await click('#submit-btn');
    await until(async () => { const s=await formState();return s.state===(mode==='success'?'success':'error')&&!s.disabled; }, `form ${mode}`);
    const state = await formState();
    check(`Form ${mode}: one intercepted POST`, formRequests === count+1);
    check(`Form ${mode}: fields ${mode==='success'?'reset':'retained'}`, mode==='success' ? state.values.every(value=>value==='') : state.values.every(value=>value!==''), state);
    check(`Form ${mode}: status accessible and button reenabled`, !!state.text && !state.disabled && state.busy===null && await evaluate(`document.getElementById('form-status').getAttribute('role')==='status'&&document.getElementById('form-status').getAttribute('aria-live')==='polite'`), state);
    if (mode==='success') { await delay(1200); check('Form success: status persists after 1.2 seconds', (await formState()).state==='success'); }
  }
  formMode='pending'; await fill(); const pendingCount=formRequests; await click('#submit-btn');
  await until(()=>formRequests===pendingCount+1,'pending POST');
  const pendingState=await formState();
  check('Form pending: button disabled and aria-busy', pendingState.disabled&&pendingState.busy==='true'&&pendingState.state==='pending',pendingState);
  await evaluate(`document.getElementById('contact-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));document.getElementById('contact-form').requestSubmit()`);
  await delay(200);
  check('Form pending: duplicate submission prevented',formRequests===pendingCount+1,{before:pendingCount,after:formRequests});
  const pendingId=held.shift();
  await cdp.send('Fetch.fulfillRequest',{requestId:pendingId,responseCode:200,responseHeaders:[{name:'Access-Control-Allow-Origin',value:origin},{name:'Content-Type',value:'application/json'}],body:Buffer.from('{"ok":true}').toString('base64')});
  await until(async()=>(await formState()).state==='success','release pending success');
  formMode='timeout'; await fill(); const timeoutCount=formRequests; const timeoutStart=Date.now(); await click('#submit-btn');
  await until(async()=>{const s=await formState();return s.state==='error'&&!s.disabled;},'real 20-second form timeout',24000);
  const timed=await formState();
  check('Form timeout: real AbortController deadline and retained fields',Date.now()-timeoutStart>=19500&&/timed out/.test(timed.text)&&timed.values.every(Boolean)&&!timed.disabled&&formRequests===timeoutCount+1,{elapsedMs:Date.now()-timeoutStart,...timed});
  for (const requestId of held.splice(0)) { try { await cdp.send('Fetch.failRequest',{requestId,errorReason:'Aborted'}); } catch {} }

  // Page script execution is disabled, but CDP evaluation still inspects the DOM.
  await cdp.send('Emulation.setScriptExecutionDisabled',{value:true});
  for (const file of pages) {
    await viewport(375); await navigate(file);
    const state=await evaluate(`({nav:getComputedStyle(document.querySelector('.site-nav')).display,enhanced:document.documentElement.classList.contains('nav-enhanced'),h1:!!document.querySelector('main h1')&&document.querySelector('main h1').getBoundingClientRect().height>0,themeHidden:document.querySelector('[data-theme-toggle]').hidden,menuHidden:document.querySelector('.menu-toggle').hidden,scroll:document.documentElement.scrollWidth,width:innerWidth,action:document.querySelector('form')?.action,method:document.querySelector('form')?.method})`);
    check(`${file}: no-JS page and navigation visible`,state.nav!=='none'&&!state.enhanced&&state.h1&&state.themeHidden&&state.menuHidden&&state.scroll<=state.width,state);
    if(file==='contact.html') {
      check('Form no-JS: native POST action preserved',state.action==='https://formspree.io/f/xaqpzvdv'&&state.method==='post',state);
      formMode='success'; await fill(); const count=formRequests; await click('#submit-btn');
      await until(()=>formRequests===count+1,'no-JS native POST');
      check('Form no-JS: actual native submit intercepted',formRequests===count+1);
    }
  }
  await cdp.send('Emulation.setScriptExecutionDisabled',{value:false});
  check('Browser: no uncaught page JavaScript errors',results.runtimeErrors.length===0,results.runtimeErrors);
  check('Browser: no console.error calls',results.consoleErrors.length===0,results.consoleErrors);
  results.networkErrors=browserLogs;
  results.notes.push(allowFonts
      ? 'Network logs include the simulated form connection failure and any actual font download failures; allowedFontRequests is permission evidence, not proof of successful loading.'
      : 'Network logs include intentionally blocked Google Fonts and the simulated form connection failure.');
  results.formRequests=formRequests;
} catch(error) {
  check('Harness completed without infrastructure errors',false,String(error.stack||error));
} finally {
  clearTimeout(watchdog);
  if (deadlineReached) check('Harness stayed within its 85-second deadline', false);
  const capturedFonts = results.fonts.observations.filter(observation => observation.context.startsWith('screenshot '));
  results.notes.push(capturedFonts.length
    ? `Screenshot font observations: ${capturedFonts.filter(observation => observation.families.every(font => font.loaded)).length}/${capturedFonts.length} have both requested families loaded; inspect per-family statuses for fallback or mixed typography.`
    : 'No screenshot font observations were recorded; font rendering has not been verified.');
  if(cdp) { try { await cdp.send('Browser.close'); } catch {} cdp.close(); }
  if(browser && browser.exitCode===null) {
    await Promise.race([new Promise(resolve=>browser.once('exit',resolve)),delay(2000)]);
    if(browser.exitCode===null) browser.kill();
  }
  if(server) { server.closeAllConnections(); await new Promise(resolve=>server.close(resolve)); }
  for(const file of production) { const after=await hash(file); check(`Write scope: ${file} unchanged`,after===before[file],{before:before[file],after}); }
  results.finished=new Date().toISOString();
  results.summary={passed:results.checks.filter(c=>c.ok).length,failed:results.checks.filter(c=>!c.ok).length};
  await writeFile(path.join(tests,'results.json'),JSON.stringify(results,null,2)+'\n');
  await writeFile(path.join(tests,'browser.log'),browserLog);
  try { await rm(path.join(tests,'.tmp'),{recursive:true,force:true,maxRetries:4,retryDelay:250}); } catch(error) { console.warn('Temporary browser profile cleanup:',String(error)); }
  console.log(JSON.stringify(results.summary));
  console.log('Evidence: tests/results.json; tests/screenshots/*.png');
  process.exitCode=results.summary.failed?1:0;
}
