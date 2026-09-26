/* =========================================================
   Diwakar — Frontend Developer
   Vanilla JS. No dependencies, no build step.
   Sections: 1 helpers · 2 header · 3 progress · 4 reveal
             5 counters · 6 rotator · 7 ticker · 8 tilt
             9 magnetic · 10 cursor · 11 copy email
   ========================================================= */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- 1. HELPERS ---------- */
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- 2. HEADER ---------- */
  const head = $('.head');
  const burger = $('#burger');
  const mmenu = $('#mmenu');

  const onScrollHeader = () => head.classList.toggle('stuck', window.scrollY > 24);

  const closeMenu = () => {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    mmenu.classList.remove('open');
    document.body.classList.remove('is-locked');
  };

  const openMenu = () => {
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    mmenu.classList.add('open');
    document.body.classList.add('is-locked');
  };

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    open ? closeMenu() : openMenu();
  });

  $$('a', mmenu).forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- 3. SCROLL PROGRESS ---------- */
  const progress = $('#progress');
  let ticking = false;

  const updateScroll = () => {
    onScrollHeader();
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? clamp(window.scrollY / max, 0, 1) : 0})`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });

  /* ---------- 4. REVEAL ON SCROLL ---------- */
  const revealables = $$('.reveal');
  revealables.forEach(el => {
    const d = el.dataset.d;
    if (d) el.style.setProperty('--d', d);
  });

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(el => io.observe(el));
  }

  /* ---------- 4b. ACTIVE NAV LINK ---------- */
  const navLinks = $$('[data-nav]');
  const sections = navLinks
    .map(a => ({ link: a, el: $(a.getAttribute('href')) }))
    .filter(s => s.el);

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const match = sections.find(s => s.el === entry.target);
        if (!match) return;
        navLinks.forEach(a => a.classList.remove('active'));
        match.link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s.el));
  }

  /* ---------- 5. COUNTERS ---------- */
  const counters = $$('.count');

  const runCount = el => {
    const target = Number(el.dataset.num) || 0;
    const dur = 1500;
    const start = performance.now();

    const step = now => {
      const t = clamp((now - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    };
    requestAnimationFrame(step);
  };

  if (!reduced && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => cio.observe(el));
  } else {
    counters.forEach(el => { el.textContent = el.dataset.num; });
  }

  /* ---------- 6. TYPE ROTATOR ---------- */
  const rot = $('#rot');
  const phrases = [
    'interfaces that feel fast.',
    'components that scale.',
    'design systems that last.',
    'accessibility, by default.',
    'motion that never janks.'
  ];

  if (rot) {
    if (reduced) {
      rot.textContent = phrases[0];
    } else {
      let i = 0;
      setInterval(() => {
        i = (i + 1) % phrases.length;
        rot.classList.remove('swap');
        void rot.offsetWidth;          // restart the animation
        rot.textContent = phrases[i];
        rot.classList.add('swap');
      }, 3000);
    }
  }

  /* ---------- 7. TICKER ---------- */
  const track = $('#ticker');
  if (track) {
    const group = track.firstElementChild;
    if (group) {
      // Clone until the track is at least twice the viewport wide, then scroll it.
      const groupWidth = group.getBoundingClientRect().width;
      if (groupWidth > 0) {
        const needed = Math.ceil((window.innerWidth * 2) / groupWidth);
        for (let n = 1; n < needed; n++) track.appendChild(group.cloneNode(true));
      }

      if (!reduced) {
        let pos = 0;
        let groupW = group.getBoundingClientRect().width || 1;
        const speed = 0.45;
        const step = () => {
          pos -= speed;
          if (pos <= -groupW) pos += groupW;
          track.style.transform = `translateX(${pos}px)`;
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }
  }

  /* ---------- 8. 3D TILT ---------- */
  const tiltables = $$('[data-tilt]');

  if (finePointer && !reduced) {
    tiltables.forEach(el => {
      const strength = el.classList.contains('name') ? 6 : 7;
      let raf = null;
      let rx = 0, ry = 0;

      const apply = () => {
        raf = null;
        el.style.transform =
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      };

      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width  - 0.5;
        const py = (e.clientY - r.top)  / r.height - 0.5;
        ry = px * strength * 2;
        rx = -py * strength * 2;
        if (!raf) raf = requestAnimationFrame(apply);
      });

      el.addEventListener('pointerleave', () => {
        rx = 0; ry = 0;
        if (!raf) raf = requestAnimationFrame(apply);
      });
    });
  }

  /* ---------- 9. MAGNETIC BUTTONS ---------- */
  if (finePointer && !reduced) {
    $$('.magnet').forEach(el => {
      let raf = null, tx = 0, ty = 0;

      const apply = () => {
        raf = null;
        el.style.translate = `${tx}px ${ty}px`;
      };

      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        ty = (e.clientY - (r.top + r.height / 2)) * 0.32;
        if (!raf) raf = requestAnimationFrame(apply);
      });

      el.addEventListener('pointerleave', () => {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(apply);
      });
    });
  }

  /* ---------- 10. CUSTOM CURSOR ---------- */
  const cursor = $('#cursor');

  if (cursor && finePointer && !reduced) {
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy, raf = null;

    const loop = () => {
      cx = lerp(cx, tx, 0.22);
      cy = lerp(cy, ty, 0.22);
      cursor.style.translate = `${cx}px ${cy}px`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', e => {
      tx = e.clientX;
      ty = e.clientY;
      cursor.classList.add('on');
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });

    document.addEventListener('pointerleave', () => cursor.classList.remove('on'));

    const growTargets = 'a, button, [data-tilt]';
    document.addEventListener('pointerover', e => {
      if (e.target.closest(growTargets)) cursor.classList.add('grow');
    });
    document.addEventListener('pointerout', e => {
      if (e.target.closest(growTargets)) cursor.classList.remove('grow');
    });
  }

  /* ---------- 11. COPY EMAIL ---------- */
  const copyBtn = $('#copyMail');
  const copyHint = $('#copyHint');

  if (copyBtn && copyHint) {
    const email = (copyBtn.getAttribute('href') || '').replace('mailto:', '').trim();

    copyBtn.addEventListener('click', async e => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(email);
        copyHint.textContent = 'copied to clipboard';
      } catch {
        copyHint.textContent = email;
      }
      copyHint.classList.add('done');
      clearTimeout(copyBtn._t);
      copyBtn._t = setTimeout(() => {
        copyHint.textContent = 'click to copy';
        copyHint.classList.remove('done');
      }, 2200);
    });
  }

  /* ---------- MISC ---------- */
  const yr = $('#yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  updateScroll();
})();
