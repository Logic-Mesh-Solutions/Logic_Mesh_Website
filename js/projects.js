(() => {
  const section = document.getElementById('projects');
  if (!section) return;
  const cards = [...section.querySelectorAll('.project-card')];
  const filters = [...section.querySelectorAll('[data-filter]')];
  const more = section.querySelector('#show-projects');
  const status = section.querySelector('#project-status');
  let category = 'all';
  let limit = 6;
  const matches = () => cards.filter(card => category === 'all' || card.dataset.category.split(' ').includes(category));
  function render() {
    const matching = matches();
    const visible = new Set(matching.slice(0, limit));
    cards.forEach(card => {
      card.hidden = !visible.has(card);
      if (card.hidden) card.querySelectorAll('details').forEach(detail => { detail.open = false; });
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    status.textContent = `Showing ${Math.min(limit, matching.length)} of ${matching.length} projects`;
    more.hidden = limit >= matching.length;
  }
  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    limit = 6;
    render();
  }));
  more.addEventListener('click', () => {
    const firstNew = matches()[limit];
    limit += 6;
    render();
    firstNew?.focus({ preventScroll: true });
  });
  render();
  section.querySelector('.project-filters').hidden = false;
  section.querySelector('.project-pagination').hidden = false;
})();
