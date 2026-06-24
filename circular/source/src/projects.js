// Reálne projekty užívateľa — zapečené priamo (statika, žiadne API za behu).
// `img` = cesta k reálnemu screenshotu (alebo null → procedurálna textúra).
// `web` = má spustiteľnú stránku (LIVE); ostatné sa zobrazia až po GitHub prepínači.
const LOGIN = 'tn89z87t2n-del'
export const liveUrl = (r) => `https://raw.githack.com/${LOGIN}/${r}/main/index.html`
export const sourceUrl = (r) => `https://github.com/${LOGIN}/${r}`

// img cesty sú relatívne (base:'./') → fungujú z /circular/ na Pages aj githacku
const IMG = (id) => `./img/${id}.jpg`

export const PROJECTS = [
  // ===== web projekty (LIVE, default) =====
  { repo: 'RT_Ray-Marching_Shader', title: 'Ray-Marching Playground', category: 'Shader / WebGL2',
    desc: 'Real-time ray-marching (sphere tracing) shader playground — inline WebGL2, zero dependencies.',
    web: true, img: IMG('RT_Ray-Marching_Shader'), hue: 300 },
  { repo: 'Fluid_simulacia', title: 'Plasma', category: 'Particles / WebGL2',
    desc: 'Interaktívna fyzikálna simulácia 100 000+ častíc v jedinom samostatnom index.html.',
    web: true, img: IMG('Fluid_simulacia'), hue: 282 },
  { repo: 'Boids_Birds_Sim', title: 'Murmuration', category: 'Simulation / Canvas',
    desc: "Large-scale flocking simulation of Craig Reynolds' boids — thousands of birds flow like liquid.",
    web: true, img: IMG('Boids_Birds_Sim'), hue: 28 },
  { repo: 'Evolution_Sim', title: 'Neuro-Evolution', category: 'Artificial Life',
    desc: 'Artificial-life evolution simulation in a single self-contained index.html — no build, no deps.',
    web: true, img: IMG('Evolution_Sim'), hue: 150 },
  { repo: 'RT_Neural_Network', title: 'Neural Net Lab', category: 'Visualizer / WebGL',
    desc: 'Trains a neural network to recognize hand-drawn digits in real time, right in your browser.',
    web: true, img: IMG('RT_Neural_Network'), hue: 265 },
  { repo: 'Lora_Propagation_Simulator', title: 'LoRa Link Planner', category: 'Simulator / Canvas',
    desc: 'Interactive LoRa radio link planning & signal propagation simulator — vanilla JS + Canvas.',
    web: true, img: IMG('Lora_Propagation_Simulator'), hue: 200 },
  { repo: 'KEE_Skuska_Otazky', title: 'KEE Quiz', category: 'App / HTML',
    desc: 'Otázky na testík zo skúšky KEE — interaktívny opakovací kvíz.',
    web: true, img: IMG('KEE_Skuska_Otazky'), hue: 250 },
  { repo: 'Test753579', title: 'Test753579', category: 'Misc / HTML',
    desc: 'Idk.',
    web: true, img: IMG('Test753579'), hue: 96 },
  // — web, ale screenshot slabý → procedurálny fallback (img:null) —
  { repo: 'Solar_system', title: 'Solar System Explorer', category: '3D / WebGL',
    desc: 'A cinematic, interactive 3D solar system in a single self-contained HTML file.',
    web: true, img: null, hue: 40 },
  { repo: 'Base64-Crc-Aes', title: 'Base64 · CRC · AES', category: 'Tool / HTML',
    desc: 'Verifikačný nástroj pre prenos dát na MSP430FR5969 — jeden samostatný index.html.',
    web: true, img: null, hue: 190 },
  { repo: '32bit_vizualizer', title: '32-bit Register Editor', category: 'Tool / HTML',
    desc: 'A tiny, dependency-free tool for inspecting and editing 32-bit registers bit by bit.',
    web: true, img: null, hue: 210 },

  // ===== ostatné repá (zobrazia sa po GitHub prepínači), karta → GitHub =====
  { repo: 'Rar_to_zip_convertor', title: 'RAR → ZIP', category: 'Flask App / Python',
    desc: 'A small, self-hosted Dockerized Flask web app that converts .rar archives to .zip / .tar.gz.',
    web: false, img: null, hue: 210 },
  { repo: 'Msp430', title: 'MSP430 IoT Sensor', category: 'Embedded / C',
    desc: 'Ultra-low-power wireless temp/humidity sensor (MSP430FR5969 + HDC2010 + E22) with AES-128.',
    web: false, img: null, hue: 16 },
  { repo: 'Mission_controll', title: 'Mission Control', category: 'Repository',
    desc: '—', web: false, img: null, hue: 330 },
  { repo: 'Mission_control_dashboard_test', title: 'Mission Control (test)', category: 'Repository',
    desc: '—', web: false, img: null, hue: 340 },
  { repo: 'Fluid_Sim', title: 'Fluid Sim', category: 'Repository',
    desc: '—', web: false, img: null, hue: 205 },
  { repo: 'Amiibo-Catalogue', title: 'Amiibo Catalogue', category: 'Repository',
    desc: '—', web: false, img: null, hue: 96 },
]

// Vráti projekty pre daný pohľad: 'live' = len web, 'all' = všetky (web prvé).
export function getProjects(view) {
  const list = view === 'live' ? PROJECTS.filter((p) => p.web) : PROJECTS
  return list.map((p, i) => ({ ...p, seed: i * 9973 + 1, index: i }))
}
