import React, { useRef, useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Leva, useControls, folder } from 'leva'
import Scene from './Scene.jsx'
import { getProjects } from './projects.js'

const MODES = ['fan', 'ring', 'gallery']

export default function App() {
  const [mode, setMode] = useState('ring')
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [hovered, setHovered] = useState(null)
  const hoveredRef = useRef(null)

  // Dev panel (leva) — dynamicky mení 3D scénu.
  const ctrl = useControls({
    Scene: folder({
      quantity: { value: 7, min: 3, max: 12, step: 1, label: 'Quantity' },
      radius: { value: 3, min: 1.5, max: 6, step: 0.1, label: 'Radius' },
      tilt: { value: 0.05, min: -0.6, max: 0.6, step: 0.01, label: 'Tilt' },
      depth: { value: 0, min: -3, max: 4, step: 0.1, label: 'Depth' },
    }),
    Rotation: folder({
      autorotate: { value: true, label: 'Rotate' },
      autorotateSpeed: { value: 0.25, min: 0, max: 1.5, step: 0.01, label: 'Speed' },
    }),
  })

  const params = useMemo(
    () => ({
      radius: ctrl.radius,
      tilt: ctrl.tilt,
      depth: ctrl.depth,
      autorotate: ctrl.autorotate,
      autorotateSpeed: ctrl.autorotateSpeed,
    }),
    [ctrl.radius, ctrl.tilt, ctrl.depth, ctrl.autorotate, ctrl.autorotateSpeed],
  )

  const projects = useMemo(() => getProjects(ctrl.quantity), [ctrl.quantity])
  const count = projects.length

  const handleHover = (i) => setHovered(i)
  const handleSelect = (i) => setSelectedIndex(i)
  const handleClose = () => setSelectedIndex(null)

  const active = selectedIndex ?? hovered ?? 0
  const selectedProject = selectedIndex !== null ? projects[selectedIndex] : null

  return (
    <div className="app">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true }}
      >
        <Scene
          projects={projects}
          mode={mode}
          params={params}
          selectedIndex={selectedIndex}
          hoveredRef={hoveredRef}
          onHover={handleHover}
          onSelect={handleSelect}
        />
      </Canvas>

      {/* ===== Header ===== */}
      <header className="ui header">
        <span className="brand">SELECTED WORKS</span>
        <div className={`segmented ${selectedIndex !== null ? 'disabled' : ''}`}>
          {MODES.map((m) => (
            <button
              key={m}
              className={mode === m ? 'seg active' : 'seg'}
              onClick={() => setMode(m)}
            >
              {m[0].toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* ===== Footer ===== */}
      <footer className="ui footer">
        <div className="status">
          <span className="dot" />
          EXPLORE
        </div>
        <div className="counter">
          {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </div>
      </footer>

      {/* ===== Detail panel ===== */}
      <div className={`detail ${selectedProject ? 'open' : ''}`}>
        {selectedProject && (
          <>
            <button className="close" onClick={handleClose} aria-label="Close">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  d="M6 6 L18 18 M18 6 L6 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="detail-info">
              <div className="cat">{selectedProject.category}</div>
              <h1 className="title">{selectedProject.title}</h1>
              <p className="desc">{selectedProject.description}</p>
              <div className="meta">
                <span>
                  <em>Studio</em>
                  {selectedProject.studio}
                </span>
                <span>
                  <em>Year</em>
                  {selectedProject.year}
                </span>
                <span>
                  <em>Size</em>
                  {selectedProject.size}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* leva dev panel (vpravo dole) */}
      <div className="leva-wrap">
        <Leva fill titleBar={{ title: 'CONTROLS', drag: false, filter: false }} />
      </div>
    </div>
  )
}
