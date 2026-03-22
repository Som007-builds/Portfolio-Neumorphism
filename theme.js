(function () {
  var s = localStorage.getItem('theme');
  var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (s === 'dark' || (s === null && d)) document.documentElement.classList.add('dark');
})();

function toggleTheme() {
  var dark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  var icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = dark ? 'light_mode' : 'dark_mode';
}

function navigate(e, url) {
  e.preventDefault();
  document.body.classList.remove('loaded');
  document.body.classList.add('fade-out');
  setTimeout(function () { window.location.href = url; }, 120);
}

document.addEventListener('DOMContentLoaded', function () {
  var icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = document.documentElement.classList.contains('dark') ? 'light_mode' : 'dark_mode';
  requestAnimationFrame(function () { document.body.classList.add('loaded'); });
});