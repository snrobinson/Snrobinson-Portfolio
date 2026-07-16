// ===========================================
// Theme toggle — dark is the default; choice persists
// (initial theme is set pre-paint by an inline script in <head>)
// ===========================================

(function () {
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        var next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) { }
    });
})();

// ===========================================
// Header — hairline border once scrolled
// ===========================================

(function () {
    var header = document.getElementById('siteHeader');
    if (!header) return;
    var onScroll = function () {
        header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// ===========================================
// Mobile navigation
// ===========================================

(function () {
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    if (!navToggle || !navLinks) return;

    var setOpen = function (open) {
        navLinks.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    navToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        setOpen(!navLinks.classList.contains('open'));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('click', function (e) {
        if (!navLinks.contains(e.target) && e.target !== navToggle) setOpen(false);
    });
})();

// ===========================================
// Scroll spy — highlight the active nav link
// ===========================================

(function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    if (!links.length) return;

    var targets = links
        .map(function (link) {
            var id = link.getAttribute('href').slice(1);
            var el = document.getElementById(id);
            return el ? { link: link, el: el } : null;
        })
        .filter(Boolean);

    var update = function () {
        var pos = window.scrollY + 120;
        var current = null;
        targets.forEach(function (t) {
            if (t.el.offsetTop <= pos) current = t;
        });
        links.forEach(function (l) { l.classList.remove('active'); });
        if (current) current.link.classList.add('active');
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
})();
