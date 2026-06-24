import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { easing } from 'maath'
import { computeTarget, CARD_H } from './layout.js'
import { makeCardTexture } from './texture.js'

export default function Card({
  project, index, count, mode, params, selectedIndex, hoveredRef, onHover, onSelect,
}) {
  const ref = useRef()
  const matRef = useRef()

  // textúra: reálny screenshot (TextureLoader) alebo procedurálny fallback
  const tex = useMemo(() => {
    if (project.img) {
      const t = new THREE.TextureLoader().load(project.img)
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
      return t
    }
    return makeCardTexture(project)
  }, [project.img, project.repo])
  useEffect(() => () => tex.dispose && tex.dispose(), [tex])

  const tmp = useMemo(() => ({
    pos: new THREE.Vector3(), euler: new THREE.Euler(), quat: new THREE.Quaternion(),
    fwd: new THREE.Vector3(), camPos: new THREE.Vector3(), world: new THREE.Vector3(),
  }), [])

  useFrame((state, dt) => {
    const m = ref.current
    if (!m) return
    const anySelected = selectedIndex !== null
    const isSelected = selectedIndex === index
    let scale = params.cardSize
    let opacity = 1

    if (anySelected) {
      if (isSelected) {
        const cam = state.camera
        const dist = 3.4
        tmp.fwd.set(0, 0, -1).applyQuaternion(cam.quaternion)
        cam.getWorldPosition(tmp.camPos)
        tmp.pos.copy(tmp.camPos).addScaledVector(tmp.fwd, dist)
        tmp.euler.set(0, 0, 0)
        const vFov = THREE.MathUtils.degToRad(cam.fov)
        const visibleH = 2 * Math.tan(vFov / 2) * dist
        scale = (visibleH * 0.82) / CARD_H
      } else {
        tmp.pos.set(0, 0, -7)
        tmp.euler.set(0, 0, 0)
        opacity = 0
      }
    } else {
      const t = computeTarget(mode, index, count, params.radius)
      tmp.pos.set(t.pos.x, t.pos.y, t.pos.z)
      tmp.euler.set(t.rot.x, t.rot.y, t.rot.z)

      // hover dôraz
      if (hoveredRef.current === index) {
        scale *= 1.14
        tmp.pos.z += 0.4
      }

      // push efekt — karty blízko kurzora sa odtlačia (Push Radius / Push Strength)
      if (params.pushStrength > 0) {
        m.updateWorldMatrix(true, false)
        tmp.world.setFromMatrixPosition(m.matrixWorld).project(state.camera)
        const dx = tmp.world.x - state.pointer.x
        const dy = tmp.world.y - state.pointer.y
        const d = Math.hypot(dx, dy)
        if (d < params.pushRadius) {
          const f = (1 - d / params.pushRadius) * params.pushStrength
          const len = Math.hypot(tmp.pos.x, tmp.pos.y) || 1
          tmp.pos.x += (tmp.pos.x / len) * f
          tmp.pos.y += (tmp.pos.y / len) * f
          tmp.pos.z += f * 0.6
        }
      }
    }

    tmp.quat.setFromEuler(tmp.euler)
    easing.damp3(m.position, tmp.pos, 0.3, dt)
    easing.dampQ(m.quaternion, tmp.quat, 0.3, dt)
    easing.damp3(m.scale, [scale, scale, scale], 0.28, dt)
    if (matRef.current) {
      easing.damp(matRef.current, 'opacity', opacity, 0.16, dt)
      m.visible = matRef.current.opacity > 0.02
    }
  })

  return (
    <RoundedBox
      ref={ref}
      args={[1, 1.4, 0.05]}
      radius={0.05}
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
        roughness={0.65}
        metalness={0.05}
      />
    </RoundedBox>
  )
}
