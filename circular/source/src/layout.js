// Matika troch rozložení. Každá funkcia vracia cieľovú pozíciu + rotáciu
// pre kartu `i` z `n` kariet, v závislosti od leva parametrov.
// pos/rot sú obyčajné objekty {x,y,z}, ktoré sa potom lerpujú v Card useFrame.

const CARD_W = 1.0
const CARD_H = 1.5

// RING — vertikálny prstenec okolo osi Y, karty čelom von.
function ringTarget(i, n, R) {
  const theta = (i / n) * Math.PI * 2
  return {
    pos: { x: R * Math.sin(theta), y: 0, z: R * Math.cos(theta) },
    rot: { x: 0, y: theta, z: 0 },
  }
}

// FAN — plytký horizontálny oblúk v spodnej časti, karty natočené do stredu.
function fanTarget(i, n, R) {
  const spread = Math.PI // 180°
  const t = n === 1 ? 0 : i / (n - 1) - 0.5 // -0.5 .. +0.5
  const angle = t * spread
  const arcR = R * 1.4
  return {
    pos: {
      x: arcR * Math.sin(angle),
      y: -R * 0.55,
      z: -arcR * (1 - Math.cos(angle)) * 0.5,
    },
    rot: { x: 0.08, y: -angle * 0.6, z: 0 },
  }
}

// GALLERY — 2 rady vedľa seba s jemným panoramatickým zakrivením.
function galleryTarget(i, n, R) {
  const rows = n > 6 ? 2 : 1
  const cols = Math.ceil(n / rows)
  const row = Math.floor(i / cols)
  const col = i % cols
  const cw = CARD_W * 1.25
  const rh = CARD_H * 1.23
  const cx = col - (cols - 1) / 2
  const cy = row - (rows - 1) / 2
  const curve = 0.18
  const x = cx * cw
  return {
    pos: {
      x,
      y: -cy * rh,
      z: -(x * x) * curve,
    },
    rot: { x: 0, y: -x * curve * 0.9, z: 0 },
  }
}

export function computeTarget(mode, i, n, params) {
  const R = params.radius
  if (mode === 'ring') return ringTarget(i, n, R)
  if (mode === 'fan') return fanTarget(i, n, R)
  return galleryTarget(i, n, R)
}

export { CARD_W, CARD_H }
