import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const sourceURL = join(__dirname, '../../packages/');

mkdirSync(join(__dirname, '../../docs'), { recursive: true });

const sources = await readdir(sourceURL);

const css = readFileSync(join(__dirname, 'style.css'));
const intro = readFileSync(join(__dirname, 'intro.html'));

let html = `
<html>
  <head>
    <style>
      ${css}
    </style>
  </head>
  <body>
    ${intro}`;

html += `
<table>
  <thead>
    <tr>
      <th>Project name</th>
      <th>Description</th>
      <th>Version</th>
    </tr>
  </thead>`;
for (let source of sources) {
  if (source.startsWith('.')) continue;
  const projectPackage = JSON.parse(
    readFileSync(join(sourceURL, source, 'package.json'), {
      encoding: 'utf-8',
    }),
  );
  html += `
  <tr>
    <td>
      <a href="${projectPackage.homepage}">${source}</a>
    </td>
    <td>
      ${projectPackage.description}
      <a href="https://cheminfo.github.io/mass-tools/${source}/" target="_blank">🔗</a>
    </td>
    <td>${projectPackage.version}</td>
  </tr>`;
}
html += '</table>';

html += '</body></html>';

writeFileSync(join(__dirname, '../../docs/index.html'), html, {
  encoding: 'utf8',
});
