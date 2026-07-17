// Reloads always begin at the top without overriding intentional hash navigation.
(function () {
    var navigation = null;
    if (window.performance && performance.getEntriesByType) {
        navigation = performance.getEntriesByType('navigation')[0] || null;
    }

    var reloaded = navigation
        ? navigation.type === 'reload'
        : !!(window.performance && performance.navigation && performance.navigation.type === 1);

    if (!reloaded) return;

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // Stop resetting the moment the visitor takes control, so the late
    // resets that defeat scroll restoration never yank an active reader.
    // (Programmatic scrollTo fires 'scroll', so it is intentionally not a
    // cancel trigger — only genuine user intent counts.)
    var cancelled = false;
    var cancel = function () { cancelled = true; };
    ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (evt) {
        window.addEventListener(evt, cancel, { once: true, passive: true });
    });

    var reset = function () {
        if (!cancelled) window.scrollTo(0, 0);
    };

    reset();
    window.addEventListener('load', reset, { once: true });
    window.addEventListener('pageshow', reset, { once: true });
    requestAnimationFrame(function () {
        requestAnimationFrame(reset);
    });
    [100, 250, 500].forEach(function (delay) {
        window.setTimeout(reset, delay);
    });
})();

// Theme preference and accessible toggle state.
(function () {
    var toggle = document.getElementById('themeToggle');
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (!toggle) return;
    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    var override = null;
    try { override = sessionStorage.getItem('themeOverride'); } catch (e) { }

    var applyTheme = function (theme) {
        document.documentElement.setAttribute('data-theme', theme);
        var isLight = document.documentElement.getAttribute('data-theme') === 'light';
        var label = isLight ? 'Switch to dark theme' : 'Switch to light theme';
        toggle.setAttribute('aria-label', label);
        toggle.setAttribute('title', label);
        if (themeColor) themeColor.setAttribute('content', isLight ? '#f4f1ea' : '#0c0c0d');
    };

    toggle.addEventListener('click', function () {
        var isLight = document.documentElement.getAttribute('data-theme') === 'light';
        override = isLight ? 'dark' : 'light';
        try { sessionStorage.setItem('themeOverride', override); } catch (e) { }
        applyTheme(override);
    });

    var syncWithSystem = function (event) {
        if (!override) applyTheme(event.matches ? 'dark' : 'light');
    };

    if (systemTheme.addEventListener) systemTheme.addEventListener('change', syncWithSystem);
    else if (systemTheme.addListener) systemTheme.addListener(syncWithSystem);

    applyTheme(override || (systemTheme.matches ? 'dark' : 'light'));
})();

// Floating return-to-top control.
(function () {
    var control = document.getElementById('backToTop');
    if (!control) return;

    var update = function () {
        var visible = window.scrollY > 240;
        control.classList.toggle('visible', visible);
        control.setAttribute('aria-hidden', visible ? 'false' : 'true');
        control.setAttribute('tabindex', visible ? '0' : '-1');
    };

    control.addEventListener('click', function () {
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    window.addEventListener('scroll', update, { passive: true });
    update();
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
        document.body.classList.toggle('nav-open', open);
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

// Proportional section progress rail.
(function () {
    var rail = document.getElementById('scrollRail');
    if (!rail) return;

    var fill = rail.querySelector('.rail-fill');
    var ticks = Array.prototype.slice.call(rail.querySelectorAll('.rail-tick[href^="#"]'));
    var activeOffset = 130;
    var maxScroll = 1;
    var scrollFrame = null;
    var resizeFrame = null;

    var targets = ticks.map(function (tick) {
        var id = tick.getAttribute('href').slice(1);
        var element = document.getElementById(id);
        return element ? { tick: tick, element: element } : null;
    }).filter(Boolean);

    if (!fill || !targets.length) return;

    var update = function () {
        var scrollY = window.scrollY;
        var progress = Math.min(1, Math.max(0, scrollY / maxScroll));
        var position = scrollY + activeOffset;
        var current = null;

        fill.style.transform = 'scaleY(' + progress + ')';
        rail.classList.toggle('visible', scrollY > 240);

        targets.forEach(function (target) {
            if (target.element.offsetTop <= position) current = target;
        });

        ticks.forEach(function (tick) {
            tick.classList.remove('active');
            tick.removeAttribute('aria-current');
        });

        if (current) {
            current.tick.classList.add('active');
            current.tick.setAttribute('aria-current', 'location');
        }
    };

    var measure = function () {
        var documentHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight
        );
        maxScroll = Math.max(1, documentHeight - window.innerHeight);

        targets.forEach(function (target) {
            var activationPoint = Math.max(0, target.element.offsetTop - activeOffset);
            var tickPosition = Math.min(100, Math.max(0, activationPoint / maxScroll * 100));
            target.tick.style.setProperty('--tick-position', tickPosition + '%');
        });

        update();
    };

    var requestUpdate = function () {
        if (scrollFrame !== null) return;
        scrollFrame = requestAnimationFrame(function () {
            scrollFrame = null;
            update();
        });
    };

    var requestMeasure = function () {
        if (resizeFrame !== null) return;
        resizeFrame = requestAnimationFrame(function () {
            resizeFrame = null;
            measure();
        });
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestMeasure);
    window.addEventListener('load', measure, { once: true });
    measure();
})();
