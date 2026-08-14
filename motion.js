// ==========================================================================
// HWS by Danielle — Motion controller
// --------------------------------------------------------------------------
// Adds the scroll-reveal behavior for motion.css. Purely additive and
// progressive: if this file never runs, motion.css does nothing (its rules are
// gated on the `.has-motion` class this script sets) and every page still
// renders fully. No HTML is edited to author reveals — targets are selected at
// runtime, so the content pages stay plain, single-file-editable HTML.
// ==========================================================================
(function () {
  var root = document.documentElement;

  // Mark the document so motion.css activates. Done immediately so hover/toggle
  // polish is available even before DOMContentLoaded.
  root.classList.add('has-motion');

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    // Single elements that reveal on their own.
    var singles = [
      '.section-head',
      '.bio-photo',
      '.bio-copy',
      '.exp-caption',
      '.tier-note',
      '.reviews-note',
      '.final-text'
    ];

    // [group container selector, child selector] — children stagger together.
    var groups = [
      ['.pain-row', '.pain-item'],
      ['.why-grid', '.why-item'],
      ['.exp-grid', '.exp-frame'],
      ['.compare-grid', '.plan'],
      ['.tier-grid', '.tier-card'],
      ['.review-grid', '.review-card'],
      ['.trans-grid', '.trans-frame'],
      ['.faq-list', '.faq-item']
    ];

    var observed = [];

    singles.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('reveal');
        observed.push(el);
      });
    });

    groups.forEach(function (pair) {
      var containers = document.querySelectorAll(pair[0]);
      containers.forEach(function (container) {
        var children = container.querySelectorAll(pair[1]);
        if (!children.length) return;
        container.classList.add('reveal-group');
        children.forEach(function (child, i) {
          child.classList.add('reveal-item');
          child.style.setProperty('--i', i);
        });
        observed.push(container);
      });
    });

    // Reduced motion or no IntersectionObserver: reveal everything now.
    if (reduceMotion || !('IntersectionObserver' in window)) {
      observed.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    observed.forEach(function (el) {
      // Elements already in view on load reveal immediately (no flash-in of
      // above-the-fold content beyond the intended hero settle).
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.add('is-visible');
      } else {
        io.observe(el);
      }
    });

    // Safety net: never leave content stuck hidden if something goes wrong.
    setTimeout(function () {
      observed.forEach(function (el) { el.classList.add('is-visible'); });
    }, 3500);
  });
})();
