import { SVG, registerWindow } from '@svgdotjs/svg.js';
import window from 'svgdom';

const document = window.document;
registerWindow(window, document);

export function getPaper() {
  return SVG(document.documentElement);
}
