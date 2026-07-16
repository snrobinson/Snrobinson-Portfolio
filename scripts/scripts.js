// ===========================================
// Theme toggle — light / dark with persistence
// (Initial theme is set pre-paint by an inline script in <head>)
// ===========================================

const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
    themeToggle.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try {
            localStorage.setItem('theme', next);
        } catch (e) { }
    });
}

// Follow the OS preference until the user makes an explicit choice
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        let stored = null;
        try {
            stored = localStorage.getItem('theme');
        } catch (err) { }
        if (!stored) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

// ===========================================
// Navigation — scroll shadow + scroll-to-top
// ===========================================

const nav = document.getElementById('nav');
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    if (window.scrollY > 300) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
});

scrollTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===========================================
// Mobile navigation — toggle + close on link click + click outside
// ===========================================

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function setNavExpanded(isOpen) {
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

navToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('open');
    setNavExpanded(isOpen);
});

navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        setNavExpanded(false);
    });
});

document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) {
        navLinks.classList.remove('open');
        setNavExpanded(false);
    }
});

// ===========================================
// Scroll Spy — highlight active nav link
// ===========================================

const sections = document.querySelectorAll('main section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a[data-section]');

function updateActiveNav() {
    let currentSection = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinkEls.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ===========================================
// Fade-in — IntersectionObserver for .fade-in elements
// ===========================================

const fadeEls = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Stagger children within grids
                    const parent = entry.target.parentElement;
                    const siblings = Array.from(parent.querySelectorAll('.fade-in'));
                    const index = siblings.indexOf(entry.target);
                    const delay = siblings.length > 1 ? index * 80 : 0;

                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        }
    );

    fadeEls.forEach(function (el) {
        observer.observe(el);
    });
} else {
    // Fallback: show everything immediately
    fadeEls.forEach(function (el) {
        el.classList.add('visible');
    });
}
