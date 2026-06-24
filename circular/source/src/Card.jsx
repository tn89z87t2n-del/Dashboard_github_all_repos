import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { easing } from 'maath'
import { computeTarget, CARD_H } from './layout.js'
import { makeCardTexture } from './texture.js'

// Jedna karta galérie. Každý frame si zráta cieľový transform (podľa módu alebo
// detail view) a damp-uje k nemu pozíciu, rotáciu, mierku aj priehľadnosť.
export default function Card({
  project,
  index,
  count,
  mode,
  params,
  selectedIndex,
  hoveredRef,
  onHover,
  onSelect,
}) {
  const ref = useRef()
  const matRef = useRef()

  // procedurálna textúra — raz na projekt
  const tex = useMemo(() => makeCardTexture(project), [project.id])
  useEffect(() => () => tex.dispose(), [tex])

  // reusovateľné dočasné objekty (žiadne alokácie v useFrame)
  const tmp = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      euler: new THREE.Euler(),
      quat: new THREE.Quaternion(),
      fwd: new THREE.Vector3(),
      camPos: new THREE.Vector3(),
    }),
    [],
  )

  useFrame((state, dt) => {
    const m = ref.current
    if (!m) return

    const anySelected = selectedIndex !== null
    const isSelected = selectedIndex === index
    let targetScale = 1
    let targetOpacity = 1

    if (anySelected) {
      if (isSelected) {
        // vybraná karta letí pred kameru a roztiahne sa na výplň viewportu
        const cam = state.camera
        const dist = 3.2
        tmp.fwd.set(0, 0, -1).applyQuaternion(cam.quaternion)
        cam.getWorldPosition(tmp.camPos)
        tmp.pos.copy(tmp.camPos).addScaledVector(tmp.fwd, dist)
        tmp.euler.set(0, 0, 0)
        const vFov = THREE.MathUtils.degToRad(cam.fov)
        const visibleH = 2 * Math.tan(vFov / 2) * dist
        targetScale = (visibleH * 0.85) / CARD_H
      } else {
        // ostatné karty odsunúť dozadu a vyfadeovať
        tmp.pos.set(0, 0, -6)
        tmp.euler.set(0, 0, 0)
        targetOpacity = 0
      }
    } else {
      // normálne rozloženie podľa aktuálneho módu
      const t = computeTarget(mode, index, count, params)
      tmp.pos.set(t.pos.x, t.pos.y, t.pos.z)
      tmp.euler.set(t.rot.x, t.rot.y, t.rot.z)
      // hover dôraz
      if (hoveredRef.current === index) {
        targetScale = 1.12
        tmp.pos.z += 0.35
      }
    }

    tmp.quat.setFromEuler(tmp.euler)

    // frame-rate nezávislý damping
    easing.damp3(m.position, tmp.pos, 0.32, dt)
    easing.dampQ(m.quaternion, tmp.quat, 0.32, dt)
    easing.damp3(m.scale, [targetScale, targetScale, targetScale], 0.3, dt)

    if (matRef.current) {
      easing.damp(matRef.current, 'opacity', targetOpacity, 0.18, dt)
      m.visible = matRef.current.opacity > 0.02
    }
  })

  return (
    <RoundedBox
      ref={ref}
      args={[1, 1.5, 0.05]}
      radius={0.06}
      smoothness={4}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (selectedIndex === null) {
          hoveredRef.current = index
          onHover(index)
          document.body.style.cursor = 'pointer'
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        if (hoveredRef.current === index) hoveredRef.current = null
        onHover(null)
        document.body.style.cursor = 'auto'
      }}
      onPointerDown={(e) => {
        e.stopPropagation()
        if (selectedIndex === null) onSelect(index)
      }}
    >
      <meshStandardMaterial
        ref={matRef}
        map={tex}
        transparent
        toneMapped={false}
        roughness={0.62}
        metalness={0.08}
      />
    </RoundedBox>
  )
}
