import { readFile, stat } from 'node:fs/promises';

const workflowPath = '.github/workflows/deploy-pages.yml';
const workflow = await readFile(workflowPath, 'utf8');
const viteConfig = await readFile('vite.config.ts', 'utf8');
const appSource = await readFile('src/App.tsx', 'utf8');

const requirements = [
  ['despliegue al hacer push en main', /push:[\s\S]*branches:[\s\S]*- main/],
  ['despliegue manual', /workflow_dispatch:/],
  ['instalación reproducible', /pnpm install --frozen-lockfile/],
  ['validación integral antes de publicar', /run: pnpm check/],
  ['artefacto generado desde dist', /path: \.\/dist/],
  ['permiso de Pages', /pages: write/],
  ['identidad OIDC de Pages', /id-token: write/],
  ['acción oficial de despliegue', /actions\/deploy-pages@v4/]
];

const errors = requirements
  .filter(([, pattern]) => !pattern.test(workflow))
  .map(([label]) => `Falta: ${label}.`);

if (!/base:\s*['"]\.\/['"]/.test(viteConfig)) {
  errors.push("Vite debe conservar base: './' para funcionar bajo /<repositorio>/.");
}

if (!/start_url:\s*['"]\.\/#\/['"]/.test(viteConfig) || !/scope:\s*['"]\.\/['"]/.test(viteConfig)) {
  errors.push('El manifiesto debe mantener start_url y scope relativos.');
}

if (!/HashRouter/.test(appSource)) {
  errors.push('La aplicación debe usar HashRouter mientras se publique en GitHub Pages.');
}

try {
  await stat('public/.nojekyll');
} catch {
  errors.push('Falta public/.nojekyll.');
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Configuración de GitHub Pages válida.');
