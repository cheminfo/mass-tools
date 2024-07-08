import { Format } from '../Format';
import { Style } from '../Style';

export function toHtml(lines) {
  let html = [];
  for (let line of lines) {
    switch (line.kind) {
      case Format.SUBSCRIPT:
        html.push(`<sub>${line.value}</sub>`);
        break;
      case Format.SUPERSCRIPT:
        html.push(`<sup>${line.value}</sup>`);
        break;
      case Format.SUPERIMPOSE:
        html.push(
          `<span style="${Style.SUPERIMPOSE}">`,
          `<sup style="${Style.SUPERIMPOSE_SUP_SUB}">${line.over}</sup>`,
          `<sub style="${Style.SUPERIMPOSE_SUP_SUB}">${line.under}</sub>`,
          '</span>',
        );
        break;
      default:
        html.push(line.value);
    }
  }
  return html.join('');
}
