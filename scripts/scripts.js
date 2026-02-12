// ===================================
// MODERN PORTFOLIO - 2026
// Stephen Robinson
// ===================================

// Strict mode
'use strict';

// ===================================
// Navigation Functions
// ===================================

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile menu toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });
}

// Close mobile menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Navbar scroll effect
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Add shadow on scroll
  if (currentScroll > 50) {
    navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
  } else {
    navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
  }
  
  lastScroll = currentScroll;
});

// ===================================
// Smooth Scrolling
// ===================================

// Smooth scroll for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Don't prevent default for links that just have "#"
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.offsetTop - navHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===================================
// Active Navigation Link
// ===================================

const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
  const scrollPosition = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightNavigation);

// ===================================
// Back to Top Button
// ===================================

const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

window.addEventListener('scroll', toggleBackToTop);

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===================================
// Intersection Observer for Animations
// ===================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for fade-in animation
const animateElements = document.querySelectorAll('.timeline-item, .project-card, .credential-card, .stat-card');

animateElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===================================
// Dynamic Year for Footer
// ===================================

const footerYear = document.querySelector('.footer p');
if (footerYear) {
  const currentYear = new Date().getFullYear();
  footerYear.textContent = `© ${currentYear} Stephen Robinson. Designed with passion for technology.`;
}

// ===================================
// Typed Effect for Hero (Optional Enhancement)
// ===================================

const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
  const roles = ['Project Manager', 'Entrepreneur', 'IT Professional', 'Business Analyst', 'Cloud Architect'];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let text = '';
  
  function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      text = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      text = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }
    
    heroSubtitle.textContent = text + ' • ' + roles[(roleIndex + 1) % roles.length] + ' • ' + roles[(roleIndex + 2) % roles.length];
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500;
    }
    
    // Uncomment below to enable typing effect
    // setTimeout(typeRole, typeSpeed);
  }
  
  // Start typing effect (commented out by default)
  // typeRole();
}

// ===================================
// Performance Optimizations
// ===================================

// Debounce function for scroll events
function debounce(func, wait = 10, immediate = true) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Apply debounce to scroll handlers
window.addEventListener('scroll', debounce(() => {
  toggleBackToTop();
  highlightNavigation();
}, 10));

// ===================================
// Lazy Loading Images
// ===================================

if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// ===================================
// Form Validation (if contact form is added)
// ===================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
      alert('Please fill in all fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Submit form (implement your backend logic here)
    console.log('Form submitted:', data);
    alert('Thank you for your message! I will get back to you soon.');
    contactForm.reset();
  });
}

// ===================================
// Accessibility Enhancements
// ===================================

// Keyboard navigation for mobile menu
if (navToggle) {
  navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navToggle.click();
    }
  });
}

// Focus trap for mobile menu
if (navMenu) {
  const focusableElements = navMenu.querySelectorAll('a, button');
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  navMenu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
}

// ===================================
// Analytics (Google Analytics 4 / Plausible)
// ===================================

// Track CTA clicks
document.querySelectorAll('.btn, .project-link, .contact-method').forEach(element => {
  element.addEventListener('click', function() {
    const action = this.textContent.trim();
    const href = this.getAttribute('href');
    
    // Log analytics event (replace with your analytics solution)
    console.log('CTA Click:', { action, href });
    
    // Example for Google Analytics 4
    // gtag('event', 'cta_click', {
    //   'event_category': 'engagement',
    //   'event_label': action,
    //   'value': href
    // });
  });
});

// ===================================
// Dark Mode Toggle (Optional)
// ===================================

const darkModeToggle = document.getElementById('darkModeToggle');

if (darkModeToggle) {
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved preference or default to system preference
  const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  darkModeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// ===================================
// Console Easter Egg
// ===================================

console.log('%c👋 Hello, Developer!', 'font-size: 20px; font-weight: bold; color: #FF6B35;');
console.log('%cLooking for something? Check out my GitHub: https://github.com/snrobinson', 'font-size: 14px; color: #004E89;');
console.log('%cInterested in connecting? Email me: snrobinson94@gmail.com', 'font-size: 14px; color: #F7B801;');

// ===================================
// Initialize
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio loaded successfully! 🚀');
  
  // Add loaded class to body for CSS animations
  document.body.classList.add('loaded');
  
  // Trigger initial checks
  toggleBackToTop();
  highlightNavigation();
});

// ===================================
// Service Worker (for PWA - Optional)
// ===================================

if ('serviceWorker' in navigator) {
  // Uncomment to enable service worker
  // window.addEventListener('load', () => {
  //   navigator.serviceWorker.register('/sw.js')
  //     .then(registration => console.log('SW registered:', registration))
  //     .catch(error => console.log('SW registration failed:', error));
  // });
}

// ===================================
// Export functions for testing
// ===================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    toggleBackToTop,
    highlightNavigation
  };
}
