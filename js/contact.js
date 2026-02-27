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

// ── CONTACT FORM (mailto) ───────────────────────────────────────
(function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const subject = form.querySelector('#subject').value.trim();
        const message = form.querySelector('#message').value.trim();

        const body = `${message}\n\n—\nFrom: ${name}\nEmail: ${email}`;
        const mailto = `mailto:mclevelandva@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailto;
    });
})();
