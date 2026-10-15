(function () {
  'use strict';

  var root = document.documentElement;
  var theme = 'dark';
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch (error) {
    // Storage may be unavailable in private browsing or under file://.
  }
  root.dataset.theme = theme;

  function init() {
    var themeButton = document.querySelector('[data-theme-toggle]');
    var themeLabel = document.querySelector('[data-theme-label]');

    function updateThemeButton() {
      if (!themeButton) return;
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      themeButton.setAttribute('aria-label', 'Switch to ' + next + ' theme');
      if (themeLabel) themeLabel.textContent = next === 'light' ? 'Light' : 'Dark';
    }

    if (themeButton) {
      themeButton.hidden = false;
      updateThemeButton();
      themeButton.addEventListener('click', function () {
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('theme', root.dataset.theme); } catch (error) {}
        updateThemeButton();
      });
      window.addEventListener('storage', function (event) {
        if (event.key !== 'theme' && event.key !== null) return;
        root.dataset.theme = event.newValue === 'light' ? 'light' : 'dark';
        updateThemeButton();
      });
    }

    var header = document.querySelector('.site-header');
    var menuButton = document.querySelector('.menu-toggle');
    var nav = document.getElementById('site-nav');
    if (header && menuButton && nav && window.matchMedia) {
      var mobile = window.matchMedia('(max-width: 760px)');

      function closeMenu(restoreFocus) {
        header.classList.remove('menu-open');
        menuButton.setAttribute('aria-expanded', 'false');
        if (restoreFocus) menuButton.focus();
      }

      function syncMenu() {
        closeMenu(false);
        menuButton.hidden = !mobile.matches;
      }

      syncMenu();
      root.classList.add('nav-enhanced');
      menuButton.addEventListener('click', function () {
        var open = header.classList.toggle('menu-open');
        menuButton.setAttribute('aria-expanded', String(open));
      });
      header.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && header.classList.contains('menu-open')) {
          closeMenu(true);
        }
      });
      document.addEventListener('click', function (event) {
        if (!header.contains(event.target)) closeMenu(false);
      });
      header.addEventListener('focusout', function (event) {
        if (!header.contains(event.relatedTarget)) closeMenu(false);
      });
      if (mobile.addEventListener) mobile.addEventListener('change', syncMenu);
      else mobile.addListener(syncMenu);
    }

    initMotion();

    var form = document.getElementById('contact-form');
    var button = document.getElementById('submit-btn');
    var label = document.getElementById('submit-label');
    var status = document.getElementById('form-status');
    if (!form || !button || !label || !status || !window.fetch || !window.FormData || !window.AbortController) return;

    var sending = false;
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (sending || !form.reportValidity()) return;
      sending = true;
      button.disabled = true;
      label.textContent = 'Sending…';
      form.setAttribute('aria-busy', 'true');
      status.dataset.state = 'pending';
      status.textContent = 'Sending your message…';
      var controller = new AbortController();
      var timeout = setTimeout(function () { controller.abort(); }, 20000);

      try {
        var response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
          signal: controller.signal
        });
        if (!response.ok) throw new Error('Submission rejected');
        status.dataset.state = 'success';
        status.textContent = 'Your message was sent. Thanks for getting in touch.';
        form.reset();
      } catch (error) {
        status.dataset.state = 'error';
        status.textContent = error.name === 'AbortError'
          ? 'The request timed out; delivery couldn’t be confirmed. Your message is still here. You can retry or email me directly.'
          : 'Your message couldn’t be sent. Your text is still here—try again or email sohamsingh572@gmail.com.';
      } finally {
        clearTimeout(timeout);
        sending = false;
        button.disabled = false;
        label.textContent = 'Send message';
        form.removeAttribute('aria-busy');
      }
    });
  }

  function initMotion() {
    if (!window.matchMedia || !window.IntersectionObserver || !Element.prototype.animate) return;
    var preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    var active = new Map();
    var observer;

    function reveal(element, delay) {
      if (preference.matches || element.contains(document.activeElement)) return;
      // Content is visible by default; motion never becomes a loading gate.
      var animation = element.animate([
        { opacity: 0, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 650, delay: delay || 0, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' });
      active.set(element, animation);
      animation.onfinish = animation.oncancel = function () { active.delete(element); };
    }

    document.querySelectorAll('.hero-copy > *, .page-heading > *').forEach(function (element, index) {
      reveal(element, Math.min(index * 65, 195));
    });
    var artwork = document.querySelector('.hero-art');
    if (artwork) reveal(artwork, 120);

    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, index) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        reveal(entry.target, Math.min(index * 45, 135));
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('.section-heading, .project-card, .strength-grid > div, .about-layout > *, .notes-preview > *, .contact-strip > *, .case-heading, .case-art, .learning-list > article, .idea-row, .journal-entry > header').forEach(function (element) {
      observer.observe(element);
    });

    document.addEventListener('focusin', function (event) {
      active.forEach(function (animation, element) {
        if (element.contains(event.target)) animation.cancel();
      });
    });
    var stopMotion = function () {
      if (!preference.matches) return;
      observer.disconnect();
      active.forEach(function (animation) { animation.cancel(); });
      active.clear();
    };
    if (preference.addEventListener) preference.addEventListener('change', stopMotion);
    else preference.addListener(stopMotion);
    window.addEventListener('pagehide', function () {
      observer.disconnect();
      active.forEach(function (animation) { animation.cancel(); });
      active.clear();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
