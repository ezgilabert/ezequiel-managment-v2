export function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  if (!themeToggle) return;

  const updateLabel = (theme) => {
    themeToggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'
    );
  };

  updateLabel(htmlEl.getAttribute('data-theme'));

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlEl.classList.add('is-theme-changing');
    htmlEl.setAttribute('data-theme', newTheme);
    updateLabel(newTheme);

    try { localStorage.setItem('theme', newTheme); } catch (e) {}

    setTimeout(() => {
      htmlEl.classList.remove('is-theme-changing');
    }, 400);
  });
}