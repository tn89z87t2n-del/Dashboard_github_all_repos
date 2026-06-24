// Matika 4 rozložení podľa referencie: Flat, Tilt, Ring, Gallery.
// Vracia cieľ {pos:{x,y,z}, rot:{x,y,z}} pre kartu i z n, podľa parametrov.
// Pozn.: globálny náklon/rotáciu prstenca rieši skupina v Scene (parallax + spin).

export const CARD_W = 1.0
export const CARD_H = 1.4

// FLAT — vzpriamený ovál kariet v rovine obrazovky, čelom k divákovi.
function flat(i, n, R) {
  const a = (i / n) * Math.PI * 2
  const Rx = R * 1.25
  const Ry = R * 1.0
  return { pos: { x: Rx * Math.sin(a), y: Ry * Math.cos(a), z: 0 }, rot: { x: 0, y: 0, z: 0 } }
}

// TILT — plytký horizontálny vejár cez stred, mierne natočené do stredu.
function tilt(i, n, R) {
  const spread = 1.5
  const t = n === 1 ? 0 : i / (n - 1) - 0.5
  const ang = t * spread
  const arcR = R * 1.7
  return {
    pos: { x: arcR * Math.sin(ang), y: -R * 0.05, z: -arcR * (1 - Math.cos(ang)) * 0.6 },
    rot: { x: 0.04, y: -ang * 0.55, z: 0 },
  }
}

// RING — karusel v rovine XZ, karty čelom von; skupina sa nakláňa v Scene → 3D elipsa.
function ring(i, n, R) {
  const a = (i / n) * Math.PI * 2
  return {
    pos: { x: R * Math.sin(a), y: 0, z: R * Math.cos(a) },
    rot: { x: 0, y: a, z: 0 },
  }
}

// GALLERY — jeden horizontálny rad cez šírku, jemné vertikálne rozhodenie + z-krivka.
function gallery(i, n, R) {
  const cw = CARD_W * 1.18
  const cx = i - (n - 1) / 2
  const x = cx * cw
  const stagger = (i % 2 === 0 ? 1 : -1) * 0.12
  return {
    pos: { x, y: stagger, z: -(x * x) * 0.04 },
    rot: { x: 0, y: -x * 0.05, z: 0 },
  }
}

export function computeTarget(mode, i, n, R) {
  if (mode === 'flat') return flat(i, n, R)
  if (mode === 'tilt') return tilt(i, n, R)
  if (mode === 'ring') return ring(i, n, R)
  return gallery(i, n, R)
}
