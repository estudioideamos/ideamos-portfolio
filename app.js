const projects = window.PROJECTS;
const grid = document.querySelector('#projects');
const dialog = document.querySelector('#project-dialog');
const labels = { tiendas: 'Tienda online', corporativos: 'Sitio corporativo', apps: 'App / solución digital' };
let active = 'todos';
let search = '';
let lastFocus;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrowIcon = "<svg class=\"arrow-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6 18 18 6M6 6h12v12\"/></svg>";
const isPagesDemo = project => Boolean(project.url && new URL(project.url).hostname.endsWith('.github.io'));
const searchIndex = new Map();
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function art(project) {
  const cuotas = project.id.includes('cuotas');
  return `<div class="plugin-art"><span class="plugin-caption">WOOCOMMERCE / EXTENSIÓN</span><span class="symbol">${cuotas ? '3×' : '✦'}</span><strong>${cuotas ? 'Más formas<br>de comprar.' : 'Productos que<br>se destacan.'}</strong><div class="plugin-sample">${cuotas ? '3 cuotas sin interés' : '<span>NUEVO</span><span>OFERTA</span>'}</div><small>${escape(project.name)}</small></div>`;
}
function cover(project) {
  if (!project.image) return `<div class="cover-scene has-mobile cover-extension"><div class="cover-heading"><span>${escape(project.name)}</span><small>EXTENSIÓN WOOCOMMERCE · VISTA ILUSTRATIVA</small></div><div class="cover-desktop"><div class="browser-bar"><i></i><i></i><i></i><span>WooCommerce / Ideamos</span></div><div class="extension-interface"><span class="extension-tag">WOOCOMMERCE</span><strong>${project.id.includes('cuotas') ? 'Comprá en cuotas.' : 'Hacé destacar tus productos.'}</strong><div class="extension-product"><span class="extension-product-icon">${project.id.includes('cuotas') ? '3×' : '✦'}</span><div><b>${project.id.includes('cuotas') ? 'Cuotas sin interés' : 'Etiquetas de producto'}</b><span>Diseñado por Ideamos</span></div></div></div></div><div class="cover-phone"><span class="phone-camera" aria-hidden="true"></span><div class="extension-mobile"><span>ideamos</span><strong>${project.id.includes('cuotas') ? '3×' : '✦'}</strong><b>${project.id.includes('cuotas') ? 'Sin interés' : 'NOVEDAD'}</b><i></i><i></i><small>WooCommerce</small></div></div><span class="cover-caption">IDEAMOS · DISEÑO DIGITAL</span></div>`;

  const host = project.url ? new URL(project.url).hostname.replace(/^www\./, '') : 'Diseño de interfaz';
  return `<div class="cover-scene has-mobile"><div class="cover-heading"><span>${escape(project.name)}</span><small>${project.isNew ? 'NUEVO PROYECTO' : labels[project.category].toUpperCase()}</small></div><div class="cover-desktop"><div class="browser-bar"><i></i><i></i><i></i><span>${escape(host)}</span></div><img data-src="${escape(project.thumb || project.cover || project.image)}" data-srcset="${escape(project.thumb)} ${project.thumbWidth}w, ${escape(project.thumbLarge)} ${project.thumbLargeWidth}w" sizes="(max-width: 480px) 73vw, (max-width: 760px) 36vw, (min-width: 1600px) 400px, 25vw" alt="Vista de escritorio de ${escape(project.name)}" loading="lazy" decoding="async" width="1100" height="764"></div>${`<div class="cover-phone"><span class="phone-camera" aria-hidden="true"></span><img data-src="${escape(project.phoneThumb || project.mobile || project.cover || project.image)}" data-srcset="${escape(project.phoneThumb)} ${project.phoneThumbWidth}w, ${escape(project.phoneThumbLarge)} ${project.phoneThumbLargeWidth}w" sizes="(max-width: 480px) 21vw, (max-width: 760px) 10vw, (min-width: 1600px) 110px, 7vw" alt="Vista móvil de ${escape(project.name)}" loading="lazy" decoding="async" width="390" height="844"></div>`}<span class="cover-caption" aria-hidden="true">IDEAMOS® · DISEÑO DIGITAL</span></div>`;
}
function observePreviews() {
  const load = img => {
    img.srcset = img.dataset.srcset;
    img.src = img.dataset.src;
    delete img.dataset.src;
    delete img.dataset.srcset;
  };
  if (!('IntersectionObserver' in window)) {
    grid.querySelectorAll('img[data-src]').forEach(load);
    return;
  }
  previewObserver.disconnect();
  grid.querySelectorAll('img[data-src]').forEach(img => previewObserver.observe(img));
}
const previewObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const {target, isIntersecting} of entries) {
    if (!isIntersecting) continue;
    target.srcset = target.dataset.srcset;
    target.src = target.dataset.src;
    delete target.dataset.src;
    delete target.dataset.srcset;
    previewObserver.unobserve(target);
  }
}, {rootMargin: '300px 0px'}) : null;
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
  document.querySelector('#dialog-image').innerHTML = project.image ? `<img src="${escape(project.image)}" alt="Diseño del proyecto ${escape(project.name)}" decoding="async" width="${project.imageWidth}" height="${project.imageHeight}">` : art(project);
  const link = document.querySelector('#dialog-link');
  link.hidden = !project.url;
  link.innerHTML = `Visitar sitio <span>↗</span>`;
  if (project.url) link.href = project.url; else link.removeAttribute('href');
  document.body.classList.add('modal-open');
  dialog.showModal();
  document.querySelector('.dialog-scroll').scrollTop = 0;
  document.querySelector('.close').focus();
}
for (const p of projects) searchIndex.set(p.id, normalize(p.name + ' ' + p.sector + ' ' + p.description + ' ' + (p.technologies || []).join(' ')));
function render() {
  const query = normalize(search);
  const visible = projects.filter(p => (active === 'todos' || p.category === active) && searchIndex.get(p.id).includes(query));
  grid.innerHTML = visible.map(p => `<article class="project"><button class="preview cover-theme-${escape(p.theme || 'slate')}" data-project="${escape(p.id)}" aria-label="Ver proyecto ${escape(p.name)}">${cover(p)}<span class="preview-label">Conocer el proyecto ↗</span></button><div class="project-meta"><div><h3><button class="project-title" data-project="${escape(p.id)}">${escape(p.name)}</button></h3><p>${escape(p.sector)}</p></div>${p.url ? `<a class="project-link" href="${escape(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="Visitar ${escape(p.name)} (nueva pestaña)">${arrowIcon}</a>` : `<button class="project-link" data-project="${escape(p.id)}" aria-label="Ver diseño de ${escape(p.name)}">${arrowIcon}</button>`}</div><span class="project-type">${labels[p.category]}${isPagesDemo(p) ? ' · Demo' : ''}</span></article>`).join('');
  observePreviews();
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
