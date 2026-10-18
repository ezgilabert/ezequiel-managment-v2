export function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlEl.classList.add('is-theme-changing');
    htmlEl.setAttribute('data-theme', newTheme);
    
    try { localStorage.setItem('theme', newTheme); } catch(e) {}
    
    setTimeout(() => {
      htmlEl.classList.remove('is-theme-changing');
    }, 400);
  });
}