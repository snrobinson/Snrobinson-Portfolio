// Theme preference and accessible toggle state.
(function () {
    var toggle = document.getElementById('themeToggle');
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (!toggle) return;

    var updateThemeControl = function () {
        var isLight = document.documentElement.getAttribute('data-theme') === 'light';
        var label = isLight ? 'Switch to dark theme' : 'Switch to light theme';
        toggle.setAttribute('aria-label', label);
        toggle.setAttribute('title', label);
        if (themeColor) themeColor.setAttribute('content', isLight ? '#f4f1ea' : '#0c0c0d');
    };

    toggle.addEventListener('click', function () {
        var isLight = document.documentElement.getAttribute('data-theme') === 'light';
        var next = isLight ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) { }
        updateThemeControl();
    });

    updateThemeControl();
})();

// Sticky-header divider.
(function () {
    var header = document.getElementById('siteHeader');
    if (!header) return;

    var onScroll = function () {
        header.classList.toggle('scrolled', window.scrollY > 8);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// Mobile navigation with explicit open/close states and Escape support.
(function () {
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    if (!navToggle || !navLinks) return;

    var setOpen = function (open, returnFocus) {
        navLinks.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
        navToggle.textContent = open ? 'close' : 'menu';
        if (!open && returnFocus) navToggle.focus();
    };

    navToggle.addEventListener('click', function (event) {
        event.stopPropagation();
        setOpen(!navLinks.classList.contains('open'), false);
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { setOpen(false, false); });
    });

    document.addEventListener('click', function (event) {
        if (!navLinks.contains(event.target) && event.target !== navToggle) setOpen(false, false);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && navLinks.classList.contains('open')) setOpen(false, true);
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 760) setOpen(false, false);
    });
})();

// Section awareness for sighted and assistive-technology users.
(function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    if (!links.length) return;

    var targets = links.map(function (link) {
        var id = link.getAttribute('href').slice(1);
        var element = document.getElementById(id);
        return element ? { link: link, element: element } : null;
    }).filter(Boolean);

    var update = function () {
        var position = window.scrollY + 130;
        var current = null;

        targets.forEach(function (target) {
            if (target.element.offsetTop <= position) current = target;
        });

        links.forEach(function (link) { link.removeAttribute('aria-current'); });
        if (current) current.link.setAttribute('aria-current', 'true');
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
})();
