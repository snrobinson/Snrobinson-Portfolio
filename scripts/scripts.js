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

navToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
        navLinks.classList.remove('open');
    });
});

document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) {
        navLinks.classList.remove('open');
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
