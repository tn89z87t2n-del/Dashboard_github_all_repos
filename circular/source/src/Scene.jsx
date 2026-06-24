import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import Card from './Card.jsx'

// Skupina, ktorá reaguje na pohyb myši (parallax), drží sklon (tilt),
// hĺbku (depth) a nepretržitú autorotáciu. Pri vybranej karte zamrzne.
function ParallaxGroup({ params, frozen, children }) {
  const g = useRef()
  const spin = useRef(0)

  useFrame((state, dt) => {
    const grp = g.current
    if (!grp) return

    const px = frozen ? 0 : state.pointer.x
    const py = frozen ? 0 : state.pointer.y

    if (params.autorotate && !frozen) {
      spin.current += params.autorotateSpeed * dt
    }

    // pri vybranej karte → skupina identita (detail target je vo world-space)
    const targetRotX = frozen ? 0 : params.tilt - py * 0.2
    const targetRotY = frozen ? 0 : px * 0.35 + spin.current
    easing.damp(grp.rotation, 'x', targetRotX, 0.3, dt)
    easing.damp(grp.rotation, 'y', targetRotY, 0.3, dt)
    easing.damp(grp.position, 'z', frozen ? 0 : -params.depth, 0.4, dt)
  })

  return <group ref={g}>{children}</group>
}

export default function Scene({ projects, mode, params, selectedIndex, hoveredRef, onHover, onSelect }) {
  const frozen = selectedIndex !== null
  const n = projects.length

  return (
    <>
      <color attach="background" args={['#0D0D0D']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 8]} intensity={1.1} />
      <directionalLight position={[-6, -2, 4]} intensity={0.4} color="#8899ff" />

      <ParallaxGroup params={params} frozen={frozen}>
        {projects.map((p, i) => (
          <Card
            key={p.id}
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
