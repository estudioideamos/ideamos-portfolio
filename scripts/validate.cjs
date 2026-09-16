const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const source = read('projects.js').trim();
assert(source.startsWith('window.PROJECTS = '), 'Unexpected catalog format');
const projects = JSON.parse(source.slice('window.PROJECTS = '.length).replace(/;$/, ''));
assert(Array.isArray(projects) && projects.length > 0, 'Empty catalog');
const files = new Set(['index.html', 'styles.css', 'app.js', 'projects.js', '404.html', 'robots.txt', 'sitemap.xml', '.nojekyll', 'assets/social.jpg']);
const local = value => {
  assert(/^(?:assets\/)?[a-zA-Z0-9_.-]+$/.test(value) && !value.includes('..'), `Unsafe path: ${value}`);
  files.add(value);
};
const ids = new Set();
for (const p of projects) {
  assert(/^[a-z0-9-]+$/.test(p.id) && !ids.has(p.id), `Invalid or duplicate id: ${p.id}`);
  ids.add(p.id);
  assert(['tiendas', 'corporativos', 'apps'].includes(p.category), `Invalid category: ${p.id}`);
  for (const key of ['name', 'sector', 'description']) assert(typeof p[key] === 'string' && p[key].trim(), `Missing ${key}: ${p.id}`);
  if (p.url) { const url = new URL(p.url); assert(url.protocol === 'https:' && !url.username && !url.password, `Unsafe URL: ${p.id}`); }
  if (p.image) local(p.image);
}
for (const file of ['index.html', '404.html', 'styles.css']) {
  for (const match of read(file).matchAll(/(?:src|href)=["']([^"']+)["']|url\(["']?([^)'"\s]+)["']?\)/g)) {
    const value = match[1] || match[2];
    if (!/^(https:|mailto:|#)/.test(value)) local(value);
  }
}
let total = 0;
for (const file of files) {
  const stat = fs.lstatSync(path.join(root, file));
  assert(stat.isFile() && !stat.isSymbolicLink(), `Not a regular file: ${file}`);
  assert(stat.size < 2 * 1024 * 1024, `Asset exceeds 2 MB: ${file}`);
  total += stat.size;
}
assert(total < 8 * 1024 * 1024, 'Site exceeds 8 MB');
const html = read('index.html');
assert(html.includes('Content-Security-Policy') && html.includes("script-src 'self'"), 'Missing script policy');
assert(!/<script\b[^>]*>(?!\s*<\/script>)[\s\S]*?<\/script>/i.test(html), 'Inline scripts are not permitted');
assert(html.includes('rel="canonical"') && html.includes('og:image'), 'Missing sharing metadata');
console.log(`Validated ${projects.length} projects, ${files.size} publishable files, ${(total / 1024).toFixed(0)} KB`);
if (process.argv.includes('--build')) {
  const output = path.join(root, '_site');
  fs.rmSync(output, {recursive: true, force: true});
  for (const file of files) { const dest = path.join(output, file); fs.mkdirSync(path.dirname(dest), {recursive: true}); fs.copyFileSync(path.join(root, file), dest); }
  console.log('Built _site from the explicit public-file allowlist.');
}
