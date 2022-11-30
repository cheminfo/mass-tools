import { SVG, registerWindow } from '@svgdotjs/svg.js';
import window from 'svgdom';

const document = window.document;
registerWindow(window, document);

export function getPaper() {
  // eslint-disable-next-line new-cap
  return SVG(document.documentElement);
}
