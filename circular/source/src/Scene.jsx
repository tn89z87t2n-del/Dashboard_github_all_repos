import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import { easing } from 'maath'
import Card from './Card.jsx'

const RING_TILT = -0.42 // náklon prstenca v RING režime (perspektíva)

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
      else { rx = py * 0.05; ry = px * 0.12; posX = -rad * 1.2 } // gallery: scroll = horizontálny pan
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
  projects, mode, params, rotation, theme, selectedIndex, hoveredRef, onHover, onSelect,
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
            hoveredRef={hoveredRef}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
      </ParallaxGroup>
    </>
  )
}
