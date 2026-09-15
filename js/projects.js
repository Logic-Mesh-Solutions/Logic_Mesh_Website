(() => {
  const section = document.getElementById('projects');
  if (!section) return;
  const track = section.querySelector('#project-grid');
  const originals = [...track.children];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const copies = originals.map(card => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.inert = true;
    track.append(copy);
    return copy;
  });
  let hovered = false;
  let touching = false;
  let cycle = 0;
  let position = 0;
  let last = 0;
  let frame = 0;
  function shouldMove() {
    return !hovered && !touching && !reduced.matches && !document.hidden && !section.contains(document.activeElement);
  }
  function measure() {
    cycle = copies[0].getBoundingClientRect().left - originals[0].getBoundingClientRect().left;
    position = track.scrollLeft;
  }
  function animate(time) {
    const elapsed = last ? Math.min(time - last, 50) : 0;
    last = time;
    if (cycle > 0) {
      position = (position + elapsed * 0.024) % cycle;
      track.scrollLeft = position;
    }
    frame = requestAnimationFrame(animate);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    position = track.scrollLeft;
    if (shouldMove()) frame = requestAnimationFrame(animate);
  }
  section.addEventListener('mouseenter', () => { hovered = true; sync(); });
  section.addEventListener('mouseleave', () => { hovered = false; sync(); });
  section.addEventListener('focusin', sync);
  section.addEventListener('focusout', () => setTimeout(sync, 0));
  track.addEventListener('pointerdown', () => { touching = true; sync(); });
  window.addEventListener('pointerup', () => { touching = false; sync(); });
  window.addEventListener('pointercancel', () => { touching = false; sync(); });
  function motionPreference() {
    copies.forEach(copy => { copy.hidden = reduced.matches; });
    measure();
    sync();
  }
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', motionPreference);
  new ResizeObserver(() => { measure(); sync(); }).observe(track);
  motionPreference();
})();
