const projects = window.PROJECTS;
const grid = document.querySelector('#projects');
const dialog = document.querySelector('#project-dialog');
const labels = { tiendas: 'Tienda online', corporativos: 'Sitio corporativo', apps: 'App / solución digital' };
let active = 'todos';
let search = '';
let lastFocus;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function art(project) {
  const cuotas = project.id.includes('cuotas');
  return `<div class="plugin-art"><span class="plugin-caption">WOOCOMMERCE / EXTENSIÓN</span><span class="symbol">${cuotas ? '3×' : '✦'}</span><strong>${cuotas ? 'Más formas<br>de comprar.' : 'Productos que<br>se destacan.'}</strong><div class="plugin-sample">${cuotas ? '3 cuotas sin interés' : '<span>NUEVO</span><span>OFERTA</span>'}</div><small>${escape(project.name)}</small></div>`;
}
function cover(project) {
  if (!project.image) return art(project);
  const host = project.url ? new URL(project.url).hostname.replace(/^www\./, '') : 'Diseño de interfaz';
  return `<div class="cover-scene ${project.mobile ? 'has-mobile' : 'desktop-only-cover'}"><div class="cover-heading"><span>${escape(project.name)}</span><small>${project.isNew ? 'NUEVO PROYECTO' : labels[project.category].toUpperCase()}</small></div><div class="cover-desktop"><div class="browser-bar"><i></i><i></i><i></i><span>${escape(host)}</span></div><img src="${escape(project.cover || project.image)}" alt="Vista de escritorio de ${escape(project.name)}" loading="lazy" decoding="async" width="1100" height="764"></div>${project.mobile ? `<div class="cover-phone"><span class="phone-camera" aria-hidden="true"></span><img src="${escape(project.mobile)}" alt="Vista móvil de ${escape(project.name)}" loading="lazy" decoding="async" width="390" height="844"></div>` : ''}<span class="cover-caption" aria-hidden="true">IDEAMOS® · DISEÑO DIGITAL</span></div>`;
}
function openProject(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;
  lastFocus = document.activeElement;
  document.querySelector('#dialog-title').textContent = project.name;
  document.querySelector('#dialog-category').textContent = project.sector;
  document.querySelector('#dialog-description').textContent = project.description;
  document.querySelector('#dialog-features').innerHTML = (project.features || []).map(f => `<span>${escape(f)}</span>`).join('');
  const stack = document.querySelector('.project-stack');
  stack.hidden = !project.technologies?.length;
  document.querySelector('#dialog-tech').innerHTML = (project.technologies || []).map(t => `<span>${escape(t)}</span>`).join('');
  document.querySelector('#dialog-image').innerHTML = project.image ? `<img src="${escape(project.image)}" alt="Diseño del proyecto ${escape(project.name)}" decoding="async">` : art(project);
  const link = document.querySelector('#dialog-link');
  link.hidden = !project.url;
  if (project.url) link.href = project.url; else link.removeAttribute('href');
  document.body.classList.add('modal-open');
  dialog.showModal();
  document.querySelector('.dialog-scroll').scrollTop = 0;
  document.querySelector('.close').focus();
}
function render() {
  const visible = projects.filter(p => (active === 'todos' || p.category === active) && normalize(p.name + ' ' + p.sector + ' ' + p.description + ' ' + (p.technologies || []).join(' ')).includes(normalize(search)));
  grid.innerHTML = visible.map(p => `<article class="project"><button class="preview cover-theme-${escape(p.theme || 'slate')}" data-project="${escape(p.id)}" aria-label="Ver proyecto ${escape(p.name)}">${cover(p)}<span class="preview-label">Conocer el proyecto ↗</span></button><div class="project-meta"><div><h3><button class="project-title" data-project="${escape(p.id)}">${escape(p.name)}</button></h3><p>${escape(p.sector)}</p></div>${p.url ? `<a class="project-link" href="${escape(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="Visitar ${escape(p.name)} (nueva pestaña)">↗</a>` : `<button class="project-link" data-project="${escape(p.id)}" aria-label="Ver diseño de ${escape(p.name)}">↗</button>`}</div><span class="project-type">${labels[p.category]}</span></article>`).join('');
  document.querySelector('.result-count').textContent = `${visible.length} proyecto${visible.length === 1 ? '' : 's'} para descubrir`;
  document.querySelector('.empty').hidden = visible.length !== 0;
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.querySelector('sup').textContent = button.dataset.filter === 'todos' ? projects.length : projects.filter(p => p.category === button.dataset.filter).length;
  });
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  active = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', b === button ? 'true' : 'false'); });
  render();
}));
document.querySelector('input[type="search"]').addEventListener('input', event => { search = event.target.value; render(); });
grid.addEventListener('click', event => { const button = event.target.closest('[data-project]'); if (button) openProject(button.dataset.project); });
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); lastFocus?.focus(); });
render();
