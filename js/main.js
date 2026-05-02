// Splash loader
(function () {
  const loader = document.getElementById('splashLoader');
  if (!loader) return;

  const fadeDelay = 180;
  const fadeDuration = 420;
  let hidden = false;
  let revealed = false;
  const hideLoader = () => {
    if (hidden) return;
    hidden = true;

    window.setTimeout(() => {
      document.body.classList.add('splash-revealing');
      loader.classList.add('hide');

      const revealPage = () => {
        if (revealed) return;
        revealed = true;
        document.body.classList.remove('splash-active', 'splash-revealing');
        document.body.removeAttribute('aria-busy');
        loader.remove();
      };

      loader.addEventListener('transitionend', (event) => {
        if (event.target === loader) revealPage();
      }, { once: true });
      window.setTimeout(revealPage, fadeDuration + 100);
    }, fadeDelay);
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, { once: true });
  }

  window.setTimeout(hideLoader, 4500);
})();

// Nav toggle
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

// Active nav link
(function () {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const page = segments.pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page) {
      a.classList.add('active');
    }
  });
})();

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.06) + 's';
  revealObserver.observe(el);
});
