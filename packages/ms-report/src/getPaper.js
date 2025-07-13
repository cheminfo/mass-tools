import { SVG, registerWindow } from '@svgdotjs/svg.js';
import { createSVGWindow } from 'svgdom';

const window = createSVGWindow();
const document = window.document;
registerWindow(window, document);

export function getPaper() {
  // eslint-disable-next-line new-cap
  return SVG(document.documentElement);
}
