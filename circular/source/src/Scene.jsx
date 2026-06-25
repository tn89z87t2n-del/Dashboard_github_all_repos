import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import { easing } from 'maath'
import Card from './Card.jsx'

const RING_TILT = -0.42 // náklon prstenca v RING režime (perspektíva)
const TAN_HALF_FOV = Math.tan((45 * Math.PI) / 180 / 2) // fov 45
const CAM_Z = 6.5

// Responzívne zmenšenie obsahu, aby sa zmestil aj na úzky (portrétový) displej.
// Šírku počítame podľa režimu; gallery sa needá obmedzovať (pannuje sa ťahaním).
function FitGroup({ mode, params, frozen, children }) {
  const ref = useRef()
  useFrame((state, dt) => {
    if (!ref.current) return
    let fit = 1
    if (!frozen) {
      const aspect = state.size.width / state.size.height
      const visHW = CAM_Z * TAN_HALF_FOV * aspect // viditeľná polovičná šírka
      const R = params.radius
      const cs = params.cardSize
      let halfW
      if (mode === 'flat') halfW = R * 1.25 + 0.5 * cs
      else if (mode === 'ring') halfW = R + 0.5 * cs
      else if (mode === 'tilt') halfW = R * 1.16 + 0.5 * cs
      else halfW = 0 // gallery → bez obmedzenia šírky (pan)
      const fitW = halfW > 0 ? (0.96 * visHW) / halfW : 1
      fit = Math.max(0.18, Math.min(1, fitW))
    }
    easing.damp3(ref.current.scale, [fit, fit, fit], 0.25, dt)
  })
  return <group ref={ref}>{children}</group>
}

function ParallaxGroup({ mode, rotation, frozen, children }) {
  const g = useRef()
  useFrame((state, dt) => {
    const grp = g.current
    if (!grp) return
    const px = frozen ? 0 : state.pointer.x
    const py = frozen ? 0 : state.pointer.y
    const rad = (rotation * Math.PI) / 180

    let rx = 0, ry = 0, rz = 0, posX = 0
    if (!frozen) {
      if (mode === 'ring') { rx = RING_TILT + py * 0.12; ry = rad + px * 0.3 }
      else if (mode === 'flat') { rx = py * 0.10; ry = px * 0.18; rz = rad * 0.15 }
      else if (mode === 'tilt') { rx = py * 0.08; ry = px * 0.20 + rad * 0.1 }
      else { rx = py * 0.05; ry = px * 0.12; posX = -rad * 1.2 } // gallery: scroll/ťah = horizontálny pan
    }
    easing.damp(grp.rotation, 'x', rx, 0.3, dt)
    easing.damp(grp.rotation, 'y', ry, 0.3, dt)
    easing.damp(grp.rotation, 'z', rz, 0.3, dt)
    easing.damp(grp.position, 'x', posX, 0.3, dt)
  })
  return <group ref={g}>{children}</group>
}

function Orb({ visible, theme }) {
  const ref = useRef()
  useFrame((state, dt) => {
    if (!ref.current) return
    const s = visible ? 1 : 0.001
    easing.damp3(ref.current.scale, [s, s, s], 0.25, dt)
  })
  return (
    <Sphere ref={ref} args={[0.5, 48, 48]} position={[0, 0, 0]}>
      <meshStandardMaterial
        color={theme === 'dark' ? '#16181f' : '#cfd2dc'}
        roughness={0.18}
        metalness={0.9}
      />
    </Sphere>
  )
}

export default function Scene({
  projects, mode, params, rotation, theme, selectedIndex, draggingRef, hoveredRef, onHover, onSelect,
}) {
  const frozen = selectedIndex !== null
  const n = projects.length
  const bg = theme === 'dark' ? '#0d0d0d' : '#e9ebf2'

  return (
    <>
      <color attach="background" args={[bg]} />
      <ambientLight intensity={theme === 'dark' ? 0.65 : 0.9} />
      <directionalLight position={[4, 6, 8]} intensity={1.0} />
      <directionalLight position={[-6, -2, 4]} intensity={0.35} color="#88aaff" />

      <FitGroup mode={mode} params={params} frozen={frozen}>
        <Orb visible={mode !== 'gallery' && !frozen} theme={theme} />
        <ParallaxGroup mode={mode} rotation={rotation} frozen={frozen}>
          {projects.map((p, i) => (
            <Card
              key={p.repo}
              project={p}
              index={i}
              count={n}
              mode={mode}
              params={params}
              selectedIndex={selectedIndex}
              draggingRef={draggingRef}
              hoveredRef={hoveredRef}
              onHover={onHover}
              onSelect={onSelect}
            />
          ))}
        </ParallaxGroup>
      </FitGroup>
    </>
  )
}
