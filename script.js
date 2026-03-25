/* ============================================================
   BIJUKUMAR BRAHMA – PORTFOLIO  |  script.js
   ============================================================ */

'use strict';

/* ---- DOM refs ---- */
const navbar     = document.getElementById('navbar');
const navLinks   = document.getElementById('navLinks');
const navToggle  = document.getElementById('navToggle');
const themeToggle= document.getElementById('themeToggle');
const themeIcon  = document.getElementById('themeIcon');
const backTop    = document.getElementById('backTop');
const contactForm= document.getElementById('contactForm');
const typedEl    = document.getElementById('typed');

/* ============================================================
   1.  NAVBAR – scroll + active link highlighting
   ============================================================ */
window.addEventListener('scroll', () => {
  // Sticky blur effect
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back-to-top button
  if (window.scrollY > 400) {
    backTop.classList.add('visible');
  } else {
    backTop.classList.remove('visible');
  }

  // Active nav link
  highlightNavLink();
});

function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

/* ============================================================
   2.  MOBILE NAV TOGGLE
   ============================================================ */
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ============================================================
   3.  THEME TOGGLE (dark / light)
   ============================================================ */
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') applyLight();
})();

themeToggle.addEventListener('click', () => {
  if (document.body.classList.contains('light')) {
    applyDark();
  } else {
    applyLight();
  }
});

function applyLight() {
  document.body.classList.add('light');
  themeIcon.className = 'fa-solid fa-sun';
  localStorage.setItem('theme', 'light');
}
function applyDark() {
  document.body.classList.remove('light');
  themeIcon.className = 'fa-solid fa-moon';
  localStorage.setItem('theme', 'dark');
}

/* ============================================================
   4.  BACK TO TOP
   ============================================================ */
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   5.  TYPED TEXT EFFECT
   ============================================================ */
const typedStrings = [
  'Aspiring Software Developer',
  'CS Student & Problem Solver',
  'Open Source Enthusiast',
  'Web Developer',
  'Python & Java Programmer',
];

let tIdx = 0, cIdx = 0, deleting = false;

function typeLoop() {
  const current = typedStrings[tIdx];

  if (!deleting) {
    typedEl.textContent = current.slice(0, cIdx + 1);
    cIdx++;
    if (cIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800); // pause before deleting
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) {
      deleting = false;
      tIdx = (tIdx + 1) % typedStrings.length;
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
typeLoop();

/* ============================================================
   6.  SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   7.  SKILL BAR ANIMATION (animate when visible)
   ============================================================ */
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        const target = fill.getAttribute('data-width');
        fill.style.width = target + '%';
      });
      skillBarObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => skillBarObserver.observe(cat));

/* ============================================================
   8.  CONTACT FORM – client-side validation & submit
   ============================================================ */
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formSuccess = document.getElementById('formSuccess');

  // Clear previous errors
  document.getElementById('nameErr').textContent  = '';
  document.getElementById('emailErr').textContent = '';
  document.getElementById('msgErr').textContent   = '';
  formSuccess.classList.remove('show');

  const name    = contactForm.name.value.trim();
  const email   = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  let valid = true;

  if (!name || name.length < 2) {
    document.getElementById('nameErr').textContent = 'Please enter your full name.';
    valid = false;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('emailErr').textContent = 'Please enter a valid email.';
    valid = false;
  }

  if (!message || message.length < 10) {
    document.getElementById('msgErr').textContent = 'Message must be at least 10 characters.';
    valid = false;
  }

  if (!valid) return;

  // Simulate sending (replace with actual backend / EmailJS / Formspree)
  const submitBtn = contactForm.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    contactForm.reset();
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1500);
});

/* ============================================================
   9.  SMOOTH SCROLL for all anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});