/* ============================================================
   script.js
   - Sticky header scroll effect
   - Hamburger menu (SP)
   - Smooth scroll
   - Scroll fade-in animation
   - Active nav link
   ============================================================ */

(function () {
  'use strict';

  // Mark JS as ready so fade animations activate
  document.body.classList.add('js-ready');

  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const spMenu = document.getElementById('spMenu');
  const spLinks = document.querySelectorAll('.sp-menu__link');
  const fadeEls = document.querySelectorAll('.js-fade');
  const navLinks = document.querySelectorAll('.header__nav-list a');
  const sections = document.querySelectorAll('section[id]');

  // ----------------------------------------------------------
  // 1. Header: add on scroll
  // ----------------------------------------------------------
  function onScroll() {
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----------------------------------------------------------
  // 2. Hamburger menu toggle
  // ----------------------------------------------------------
  hamburger.addEventListener('click', function () {
    const isOpen = hamburger.classList.toggle('is-open');
    spMenu.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    spMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close SP menu when a link is clicked
  spLinks.forEach(function (link) {
    link.addEventListener('click', closeSpMenu);
  });

  function closeSpMenu() {
    hamburger.classList.remove('is-open');
    spMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    spMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ----------------------------------------------------------
  // 3. Smooth scroll for anchor links (fallback for old browsers)
  // ----------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ----------------------------------------------------------
  // 4. Scroll fade-in (IntersectionObserver)
  // ----------------------------------------------------------
  function showInView() {
    fadeEls.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 60 && rect.bottom > -60) {
        el.classList.add('is-visible');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '60px 0px 60px 0px' }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // Show in-view elements immediately, and again on scroll/resize
  showInView();
  window.addEventListener('scroll', showInView, { passive: true });
  window.addEventListener('resize', showInView, { passive: true });
  // Ensure elements are visible after full load
  window.addEventListener('load', function () {
    requestAnimationFrame(showInView);
  });

  // ----------------------------------------------------------
  // 5. Active nav link based on scroll position
  // ----------------------------------------------------------
  function updateActiveNav() {
    const scrollY = window.scrollY;
    const headerH = header.offsetHeight;
    let current = '';

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - headerH - 60;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('is-active');
      }
    });
  }

  // ----------------------------------------------------------
  // 6. Contact form: basic validation & submit
  // ----------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = this.querySelector('[name="name"]').value.trim();
      const email = this.querySelector('[name="email"]').value.trim();
      const message = this.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        alert('すべての項目を入力してください。');
        return;
      }

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        alert('正しいメールアドレスを入力してください。');
        return;
      }

      // Success message (replace with actual form submission as needed)
      alert('お問い合わせを送信しました。ありがとうございます。');
      contactForm.reset();
    });
  }

})();
