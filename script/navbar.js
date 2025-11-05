

/* ============================================================= */
/* navbar.js – Mobile menu + dropdown handling (no hover on mobile) */
/* ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn   = document.querySelector('.mobile-menu-btn');
  const navLinks    = document.querySelector('.nav-links');
  const hamburger   = mobileBtn?.querySelectorAll('.hamburger-line') || [];
  const dropdowns   = document.querySelectorAll('.dropdown');
  const body        = document.body;

  /* ---------- 1. Mobile menu toggle ---------- */
  const toggleMenu = () => {
    const open = navLinks.classList.toggle('active');
    mobileBtn?.setAttribute('aria-expanded', open);
    body.classList.toggle('mobile-menu-open', open);

    // Hamburger → X
    hamburger.forEach((line, i) => {
      if (i === 0) line.style.transform = open ? 'rotate(45deg) translate(6px,6px)' : '';
      if (i === 1) line.style.opacity   = open ? '0' : '1';
      if (i === 2) line.style.transform = open ? 'rotate(-45deg) translate(7px,-7px)' : '';
    });
  };
  mobileBtn?.addEventListener('click', toggleMenu);

  /* ---------- 2. Close menu on link click (mobile) ---------- */
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileBtn?.setAttribute('aria-expanded', 'false');
        body.classList.remove('mobile-menu-open');
        resetHamburger();
      }
    });
  });

  /* ---------- 3. Mobile dropdown (click) ---------- */
  dropdowns.forEach(d => {
    const toggle = d.querySelector('.dropdown-toggle') || d.querySelector('a');
    toggle?.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const isActive = d.classList.toggle('active');
        // close others
        dropdowns.forEach(o => { if (o !== d) o.classList.remove('active'); });
      }
    });
  });

  /* ---------- 4. Close dropdowns when clicking outside ---------- */
  document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown') && !e.target.closest('.mobile-menu-btn')) {
      dropdowns.forEach(d => d.classList.remove('active'));
    }
  });

  /* ---------- 5. Reset hamburger ---------- */
  const resetHamburger = () => {
    hamburger.forEach(l => {
      l.style.transform = '';
      l.style.opacity   = '1';
    });
  };

  /* ---------- 6. Resize handling ---------- */
  let rTimer;
  window.addEventListener('resize', () => {
    clearTimeout(rTimer);
    rTimer = setTimeout(() => {
      if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        body.classList.remove('mobile-menu-open');
        dropdowns.forEach(d => d.classList.remove('active'));
        resetHamburger();
      }
    }, 150);
  });

  /* ---------- 7. ESC key closes everything ---------- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      navLinks.classList.remove('active');
      body.classList.remove('mobile-menu-open');
      dropdowns.forEach(d => d.classList.remove('active'));
      resetHamburger();
    }
  });
});