// Nav: add .scrolled class when page scrolls past the nav height
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── THEME TOGGLE ────────────────────────────────────────────────
(function () {
    const toggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Determine initial theme: localStorage > prefers-color-scheme > dark
    function getPreferred() {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
    }

    applyTheme(getPreferred());

    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            applyTheme(current === 'light' ? 'dark' : 'light');
        });
    }
})();
