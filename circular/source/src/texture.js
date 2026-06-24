import * as THREE from 'three'

// Vygeneruje procedurálnu portrétovú textúru karty z farby (hue) a seedu.
// Gradient + radiálny glow + seedovaný šum + text (kategória hore, názov dole).
export function makeCardTexture(project) {
  const W = 512
  const H = 768
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const h = project.hue

  // 1. základný vertikálny gradient
  const g = ctx.createLinearGradient(0, 0, W * 0.4, H)
  g.addColorStop(0, `hsl(${h}, 60%, 22%)`)
  g.addColorStop(0.5, `hsl(${(h + 25) % 360}, 55%, 14%)`)
  g.addColorStop(1, `hsl(${(h + 50) % 360}, 50%, 8%)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // 2. mäkký radiálny glow
  const rg = ctx.createRadialGradient(W * 0.7, H * 0.32, 0, W * 0.7, H * 0.32, W * 0.85)
  rg.addColorStop(0, `hsla(${(h + 15) % 360}, 80%, 60%, 0.38)`)
  rg.addColorStop(1, 'hsla(0,0%,0%,0)')
  ctx.fillStyle = rg
  ctx.fillRect(0, 0, W, H)

  // 3. seedovaný value-noise grain (deterministický PRNG)
  let s = project.seed >>> 0
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
  const img = ctx.getImageData(0, 0, W, H)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const nz = (rnd() - 0.5) * 18
    d[i] += nz
    d[i + 1] += nz
    d[i + 2] += nz
  }
  ctx.putImageData(img, 0, 0)

  // 4. jemný spodný tieň pre čitateľnosť textu
  const shade = ctx.createLinearGradient(0, H * 0.55, 0, H)
  shade.addColorStop(0, 'hsla(0,0%,0%,0)')
  shade.addColorStop(1, 'hsla(0,0%,0%,0.55)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, W, H)

  // 5. typografia
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.font = "600 19px Inter, Helvetica, Arial, sans-serif"
  ctx.fillText(project.category.toUpperCase(), 40, 62)

  ctx.fillStyle = '#F5F5F5'
  ctx.font = "700 60px Inter, Helvetica, Arial, sans-serif"
  ctx.fillText(project.title, 40, H - 56)

  // tenká akcentná linka
  ctx.fillStyle = `hsl(${(h + 15) % 360}, 80%, 62%)`
  ctx.fillRect(40, H - 38, 64, 4)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}
