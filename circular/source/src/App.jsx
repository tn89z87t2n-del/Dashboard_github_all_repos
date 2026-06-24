import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene.jsx'
import { getProjects, liveUrl, sourceUrl } from './projects.js'

const MODES = ['flat', 'tilt', 'ring', 'gallery']
const DEFAULTS = { cardSize: 1.0, radius: 3.0, pushRadius: 0.0, pushStrength: 0.0 }

// malý slider do CONTROLS panela
function Slider({ label, value, min, max, step, fmt, onChange }) {
  return (
    <div className="ctrl-row">
      <div className="ctrl-head">
        <span>{label}</span>
        <span className="ctrl-val">{fmt ? fmt(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))} />
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState('flat')
  const [view, setView] = useState('live') // 'live' (11 web) | 'all' (17)
  const [theme, setTheme] = useState('dark')
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [controlsOpen, setControlsOpen] = useState(false)
  const [rotation, setRotation] = useState(0) // stupne, ovláda slider + scroll
  const [params, setParams] = useState(DEFAULTS)
  const hoveredRef = useRef(null)

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => { document.documentElement.dataset.view = view }, [view])

  const projects = useMemo(() => getProjects(view), [view])
  const count = projects.length

  // selectedIndex môže ostať mimo rozsah pri prepnutí view → ošetri
  useEffect(() => { if (selectedIndex !== null && selectedIndex >= count) setSelectedIndex(null) }, [count, selectedIndex])

  // scroll = otáčanie / explore
  const onWheel = useCallback((e) => {
    if (selectedIndex !== null) return
    setRotation((r) => r + e.deltaY * 0.12)
  }, [selectedIndex])

  const sceneParams = useMemo(() => ({ ...params }), [params])
  const selected = selectedIndex !== null ? projects[selectedIndex] : null
  const active = (selectedIndex ?? hovered ?? 0) + 1

  return (
    <div className="app" onWheel={onWheel}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6.5], fov: 45 }} gl={{ antialias: true }}>
        <Scene
          projects={projects}
          mode={mode}
          params={sceneParams}
          rotation={rotation}
          theme={theme}
          selectedIndex={selectedIndex}
          hoveredRef={hoveredRef}
          onHover={setHovered}
          onSelect={setSelectedIndex}
        />
      </Canvas>

      {/* ===== Header ===== */}
      <header className="ui header">
        <span className="brand">SELECTED WORKS</span>
        <div className={`controls-right ${selectedIndex !== null ? 'hidden' : ''}`}>
          <div className="segmented">
            {MODES.map((m) => (
              <button key={m} className={mode === m ? 'seg active' : 'seg'} onClick={() => setMode(m)}>
                {m[0].toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
          {/* theme toggle */}
          <button className="iconbtn" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            title="Deň / noc" aria-label="Téma">
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            )}
          </button>
          {/* GitHub LIVE/ALL toggle */}
          <button className={`iconbtn gh ${view === 'all' ? 'on' : ''}`} onClick={() => setView((v) => (v === 'live' ? 'all' : 'live'))}
            title={view === 'live' ? 'Zobraziť všetky repá' : 'Len web stránky'} aria-label="GitHub">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" /></svg>
          </button>
        </div>
      </header>

      {/* ===== CONTROLS panel + ikona na pravom okraji ===== */}
      <button className={`controls-toggle ${controlsOpen ? 'open' : ''} ${selectedIndex !== null ? 'hidden' : ''}`}
        onClick={() => setControlsOpen((o) => !o)} title="Controls" aria-label="Controls">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <line x1="4" y1="8" x2="20" y2="8" /><circle cx="9" cy="8" r="2.2" fill="currentColor" stroke="none" />
          <line x1="4" y1="16" x2="20" y2="16" /><circle cx="15" cy="16" r="2.2" fill="currentColor" stroke="none" />
        </svg>
      </button>
      <aside className={`controls-panel ${controlsOpen ? 'open' : ''}`}>
        <div className="cp-title">CONTROLS</div>
        <Slider label="Card Size" value={params.cardSize} min={0.5} max={1.8} step={0.01}
          fmt={(v) => `${Math.round(v * 100)}%`} onChange={(v) => setParams((p) => ({ ...p, cardSize: v }))} />
        <Slider label="Radius" value={params.radius} min={1.8} max={6} step={0.05}
          fmt={(v) => `${Math.round((v / 3) * 100)}%`} onChange={(v) => setParams((p) => ({ ...p, radius: v }))} />
        <Slider label="Rotation" value={rotation} min={-180} max={180} step={1}
          fmt={(v) => `${Math.round(v)}°`} onChange={setRotation} />
        <Slider label="Push Radius" value={params.pushRadius} min={0} max={1} step={0.01}
          fmt={(v) => (v === 0 ? 'OFF' : v.toFixed(2))} onChange={(v) => setParams((p) => ({ ...p, pushRadius: v }))} />
        <Slider label="Push Strength" value={params.pushStrength} min={0} max={1.5} step={0.01}
          fmt={(v) => (v === 0 ? 'OFF' : v.toFixed(2))} onChange={(v) => setParams((p) => ({ ...p, pushStrength: v }))} />
        <button className="cp-reset" onClick={() => { setParams(DEFAULTS); setRotation(0) }}>RESET</button>
      </aside>

      {/* ===== Footer ===== */}
      <footer className="ui footer">
        <div className="status">
          <span className="logo">N</span>
          <span className="dim">SCROLL TO EXPLORE</span>
        </div>
        <div className="counter">{String(active).padStart(2, '0')} — {String(count).padStart(2, '0')}</div>
      </footer>

      {/* ===== Cinematický detail ===== */}
      <div className={`detail ${selected ? 'open' : ''}`}>
        {selected && (
          <>
            <button className="close" onClick={() => setSelectedIndex(null)} aria-label="Zavrieť">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
            </button>
            <div className="detail-info">
              <div className="cat">{selected.category}</div>
              <h1 className="title">{selected.title}</h1>
              <p className="desc">{selected.desc}</p>
              <div className="meta">
                <span><em>Repo</em>{selected.repo}</span>
                <span><em>Typ</em>{selected.web ? 'Live web' : 'Source'}</span>
              </div>
              <a className="open-btn" href={selected.web ? liveUrl(selected.repo) : sourceUrl(selected.repo)}
                target="_blank" rel="noopener noreferrer">
                {selected.web ? 'Otvoriť stránku' : 'Otvoriť na GitHube'}
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
