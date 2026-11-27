/**
 * Vector artwork for the starry sky around the page (see StarrySky.astro and the footer).
 *
 * Everything is generated at build time as inline SVG, so it follows the theme colours:
 * `--sky-gold`, `--sky-gold-light`, `--sky-glow` and `--sky-line`.
 */

type Point = [x: number, y: number];

const GOLD = 'var(--sky-gold)';
const GOLD_LIGHT = 'var(--sky-gold-light)';
const GLOW = 'var(--sky-glow)';
const LINE = 'var(--sky-line)';

const stop = (offset: number, color: string, opacity = 1) =>
  `<stop offset="${offset}" style="stop-color:${color};stop-opacity:${opacity}"/>`;

/** Gradients shared by the shapes of one drawing. `id` must be unique on the page. */
const defs = (id: string) => `<defs>
  <linearGradient id="${id}-gold" x1="0" y1="0" x2="1" y2="1">${stop(0, GOLD_LIGHT)}${stop(0.5, GOLD)}${stop(1, GOLD_LIGHT)}</linearGradient>
  <linearGradient id="${id}-orbit">${stop(0, GOLD, 0)}${stop(0.35, GOLD, 0.85)}${stop(0.7, GOLD_LIGHT, 0.75)}${stop(1, GOLD, 0)}</linearGradient>
  <linearGradient id="${id}-stream">${stop(0, LINE, 0)}${stop(0.3, LINE, 0.55)}${stop(0.7, LINE, 0.4)}${stop(1, LINE, 0)}</linearGradient>
  <radialGradient id="${id}-halo">${stop(0, GLOW, 0.95)}${stop(0.35, GLOW, 0.45)}${stop(1, GLOW, 0)}</radialGradient>
  <linearGradient id="${id}-moon" x1="0" y1="0" x2="1" y2="1">${stop(0, GLOW)}${stop(1, GOLD)}</linearGradient>
</defs>`;

const drawing = (className: string, id: string, width: number, height: number, align: string, body: string) =>
  `<svg class="${className}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="${align} meet" focusable="false">${defs(id)}${body}</svg>`;

/** Four long concave points. */
const spike = (x: number, y: number, long: number, thin: number) =>
  `M${x} ${y - long}Q${x + thin * 0.35} ${y - thin} ${x + long * 0.62} ${y}Q${x + thin * 0.35} ${y + thin} ${x} ${y + long}Q${x - thin * 0.35} ${y + thin} ${x - long * 0.62} ${y}Q${x - thin * 0.35} ${y - thin} ${x} ${y - long}Z`;

const bigStar = (id: string, x: number, y: number, r: number, halo = 1) =>
  `<circle cx="${x}" cy="${y}" r="${r * 1.25}" fill="url(#${id}-halo)" opacity="${halo}"/>
  <path d="${spike(x, y, r * 0.5, r * 0.09)}" fill="url(#${id}-gold)" opacity=".75" transform="rotate(45 ${x} ${y})"/>
  <path d="${spike(x, y, r, r * 0.13)}" fill="url(#${id}-gold)"/>
  <circle cx="${x}" cy="${y}" r="${r * 0.1}" style="fill:${GLOW}"/>`;

const spark = (id: string, x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r * 1.3}" fill="url(#${id}-halo)" opacity=".6"/><path d="${spike(x, y, r, r * 0.2)}" fill="url(#${id}-gold)" opacity=".95"/>`;

/** A small spark in the line colour, without a glow. */
const faintSpark = (x: number, y: number, r: number) =>
  `<path d="${spike(x, y, r, r * 0.2)}" style="fill:${LINE}" opacity=".7"/>`;

const orbit = (id: string, x: number, y: number, rx: number, ry: number, angle: number) =>
  `<g transform="rotate(${angle} ${x} ${y})" fill="none">
    <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" stroke="url(#${id}-orbit)" stroke-width="1.6"/>
    <ellipse cx="${x + 5}" cy="${y + 4}" rx="${rx * 0.97}" ry="${ry * 0.9}" stroke="url(#${id}-orbit)" stroke-width=".6"/>
    <circle cx="${x - rx * 0.72}" cy="${y + ry * 0.69}" r="3" fill="url(#${id}-gold)"/>
  </g>`;

/** Part of an astrolabe grid: arcs from angle `from` to `to`, with spokes. */
const web = (x: number, y: number, radii: number[], from: number, to: number) => {
  const at = (r: number, degrees: number) => {
    const a = (degrees * Math.PI) / 180;
    return `${(x + r * Math.cos(a)).toFixed(1)} ${(y + r * Math.sin(a)).toFixed(1)}`;
  };
  const arcs = radii.map((r, i) => {
    const dashed = i === radii.length - 1 ? ' stroke-dasharray="2 6"' : '';
    return `<path d="M${at(r, from)}A${r} ${r} 0 0 1 ${at(r, to)}"${dashed}/>`;
  });
  const spokes = [0, 1, 2, 3, 4].map((i) => {
    const angle = from + ((to - from) * i) / 4;
    return `<path d="M${at(radii[0], angle)}L${at(radii[radii.length - 2], angle)}"/>`;
  });
  return `<g fill="none" style="stroke:${LINE}" stroke-width=".9" opacity=".42">${arcs.join('')}${spokes.join('')}</g>`;
};

/** A constellation: a thin line with a node or spark at each point. */
const constellation = (id: string, points: Point[]) =>
  `<polyline points="${points.map((p) => p.join(',')).join(' ')}" fill="none" style="stroke:${LINE}" stroke-width=".8" opacity=".45"/>` +
  points
    .map(([x, y], i) =>
      i % 3 === 1
        ? spark(id, x, y, 8)
        : `<circle cx="${x}" cy="${y}" r="5" style="fill:${LINE}" opacity=".16"/><circle cx="${x}" cy="${y}" r="2" style="fill:${LINE}" opacity=".8"/>`,
    )
    .join('');

/** Scattered dots. Positions are computed from the seed, so every build is identical. */
const dust = (seed: number, height: number) =>
  Array.from({ length: 34 }, (_, i) => {
    const x = ((i * 137 + seed * 53) % 420) + 10;
    const y = ((i * 211 + seed * 97) % (height - 20)) + 10;
    return `<circle cx="${x}" cy="${y}" r="${i % 6 ? 0.9 : 1.7}" style="fill:${i % 4 ? LINE : GOLD}" opacity=".6"/>`;
  }).join('');

/** Left margin: top, middle and bottom drawings. */
export const leftSky = () =>
  drawing('sky-top', 'sky-lt', 440, 420, 'xMinYMin',
    dust(1, 420) + web(-20, 150, [95, 140, 185, 215], -65, 65) + orbit('sky-lt', 150, 140, 165, 48, -24) +
    bigStar('sky-lt', 128, 118, 46) + spark('sky-lt', 292, 62, 13) + faintSpark(70, 305, 9) + spark('sky-lt', 245, 330, 7)) +
  drawing('sky-mid', 'sky-lm', 440, 340, 'xMinYMid',
    dust(3, 340) + constellation('sky-lm', [[48, 70], [128, 120], [108, 196], [196, 238], [286, 206], [322, 288]]) +
    faintSpark(250, 66, 10) + spark('sky-lm', 52, 270, 11)) +
  drawing('sky-low', 'sky-ll', 440, 400, 'xMinYMax',
    dust(11, 400) + web(-30, 400, [110, 160, 215, 250], -100, 5) + orbit('sky-ll', 150, 282, 170, 50, -16) +
    constellation('sky-ll', [[60, 74], [150, 118], [236, 88], [300, 160], [262, 236]]) +
    bigStar('sky-ll', 112, 306, 22, 0.6) + spark('sky-ll', 326, 316, 9) + faintSpark(58, 190, 9));

/** Right margin: top (with the moon), middle and bottom drawings. */
export const rightSky = () =>
  drawing('sky-top', 'sky-rt', 440, 420, 'xMaxYMin',
    dust(5, 420) + web(460, 130, [90, 132, 178, 210], 115, 245) + orbit('sky-rt', 285, 150, 175, 52, 22) +
    `<circle cx="318" cy="150" r="74" fill="url(#sky-rt-halo)" opacity=".7"/><path d="M322 96A56 56 0 1 0 372 182A46 46 0 1 1 322 96Z" fill="url(#sky-rt-moon)"/>` +
    bigStar('sky-rt', 138, 78, 30) + faintSpark(190, 258, 9) + spark('sky-rt', 392, 300, 12) + spark('sky-rt', 80, 190, 7)) +
  drawing('sky-mid', 'sky-rm', 440, 340, 'xMaxYMid',
    dust(8, 340) + constellation('sky-rm', [[392, 40], [318, 96], [338, 178], [248, 214], [262, 292], [166, 308]]) +
    spark('sky-rm', 160, 90, 11) + faintSpark(400, 268, 9)) +
  drawing('sky-low', 'sky-rl', 440, 400, 'xMaxYMax',
    dust(14, 400) + web(470, 400, [105, 150, 205, 240], 175, 280) + orbit('sky-rl', 285, 290, 160, 46, 18) +
    constellation('sky-rl', [[390, 70], [300, 106], [214, 78], [150, 158], [188, 232]]) +
    bigStar('sky-rl', 326, 312, 20, 0.6) + spark('sky-rl', 104, 322, 9) + faintSpark(396, 188, 9));

/** Foot of the page: flowing lines around a single star. */
export const footerSky = () => {
  const id = 'sky-foot';
  const stream = (d: string, width: number) =>
    `<path d="${d}" fill="none" stroke="url(#${id}-stream)" stroke-width="${width}"/>`;
  return drawing('footer-sky', id, 1600, 180, 'xMidYMax',
    stream('M0 138C260 96 480 168 800 132S1340 92 1600 128', 1.4) +
    stream('M120 156C400 128 590 178 860 152S1280 126 1500 150', 0.9) +
    stream('M260 112C500 84 640 122 800 108S1120 70 1360 96', 0.6) +
    orbit(id, 800, 78, 270, 32, -3) + bigStar(id, 800, 70, 26, 0.8) +
    spark(id, 590, 52, 9) + spark(id, 1030, 40, 11) + spark(id, 420, 112, 6) + spark(id, 1215, 104, 7) +
    faintSpark(690, 122, 6) + faintSpark(930, 112, 6) + faintSpark(300, 70, 5) + faintSpark(1330, 62, 5));
};
