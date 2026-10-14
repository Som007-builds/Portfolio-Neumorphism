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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
