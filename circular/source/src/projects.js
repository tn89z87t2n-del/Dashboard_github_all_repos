// Dáta projektov galérie. Procedurálne textúry sa generujú z `hue` a `seed`,
// takže žiadne externé obrázky nie sú potrebné.
export const PROJECTS = [
  {
    id: 'rift',
    category: 'Concept Art / Short Film',
    title: 'Rift',
    description:
      'A fracture in spacetime opens above a dying city. Volumetric light and debris drift through the tear in a single unbroken shot.',
    studio: 'Nebula Works',
    year: '2025',
    size: '4K · 2.5 min',
    hue: 268,
  },
  {
    id: 'event-horizon',
    category: 'Cinematic / VFX',
    title: 'Event Horizon',
    description:
      'The last frame before the fall. A lone vessel skims the accretion disk of a supermassive black hole.',
    studio: 'Apsis Studio',
    year: '2024',
    size: '6K · 90 sec',
    hue: 198,
  },
  {
    id: 'aurora',
    category: 'Environment / Matte',
    title: 'Aurora',
    description:
      'Polar skies rendered as living glass — slow ribbons of plasma folding over a frozen sea.',
    studio: 'Helio Lab',
    year: '2025',
    size: '4K · stills',
    hue: 150,
  },
  {
    id: 'monolith',
    category: 'Hard Surface / Design',
    title: 'Monolith',
    description:
      'An impossible structure carved from a single block of obsidian, scaled against an indifferent desert.',
    studio: 'Form & Field',
    year: '2023',
    size: '8K · stills',
    hue: 24,
  },
  {
    id: 'bloom',
    category: 'Motion / Generative',
    title: 'Bloom',
    description:
      'Procedural flora unfurling in time-lapse, each petal a particle of light reacting to unseen currents.',
    studio: 'Verdant',
    year: '2024',
    size: '4K · loop',
    hue: 330,
  },
  {
    id: 'undertow',
    category: 'Simulation / FX',
    title: 'Undertow',
    description:
      'A wall of water folds in on itself in slow motion, foam resolved down to the spray.',
    studio: 'Deepwater FX',
    year: '2025',
    size: '6K · 45 sec',
    hue: 210,
  },
  {
    id: 'ember',
    category: 'Lighting / Mood',
    title: 'Ember',
    description:
      'A single coal of a sun setting behind ruins — warm haze, long shadows, quiet decay.',
    studio: 'Lumen House',
    year: '2023',
    size: '4K · stills',
    hue: 16,
  },
  {
    id: 'signal',
    category: 'Title Design / UI',
    title: 'Signal',
    description:
      'Holographic interfaces blooming out of static — a broadcast from somewhere that no longer exists.',
    studio: 'Carrier',
    year: '2025',
    size: '4K · 30 sec',
    hue: 285,
  },
  {
    id: 'glacier',
    category: 'Environment / Look-dev',
    title: 'Glacier',
    description:
      'Subsurface blue trapped a thousand years deep, fracturing under its own ancient weight.',
    studio: 'Northwind',
    year: '2024',
    size: '8K · stills',
    hue: 186,
  },
  {
    id: 'corona',
    category: 'Cinematic / VFX',
    title: 'Corona',
    description:
      'Solar flares choreographed into a slow dance — magnetism made visible at the edge of a star.',
    studio: 'Apsis Studio',
    year: '2025',
    size: '6K · 60 sec',
    hue: 42,
  },
  {
    id: 'mirage',
    category: 'Concept Art / Keyframe',
    title: 'Mirage',
    description:
      'A floating oasis that may or may not be there, rendered between heat and memory.',
    studio: 'Nebula Works',
    year: '2023',
    size: '4K · stills',
    hue: 96,
  },
  {
    id: 'fathom',
    category: 'Creature / Design',
    title: 'Fathom',
    description:
      'Bioluminescent life from the crushing deep, lit only by what it carries inside.',
    studio: 'Deepwater FX',
    year: '2024',
    size: '4K · stills',
    hue: 172,
  },
]

// Vráti pole presne `count` projektov; ak treba viac než je v dátach, cyklí.
export function getProjects(count) {
  const n = Math.max(1, Math.round(count))
  const out = []
  for (let i = 0; i < n; i++) {
    const base = PROJECTS[i % PROJECTS.length]
    // unikátne id + seed aj pri cyklení, nech sa textúry líšia
    out.push({
      ...base,
      id: i < PROJECTS.length ? base.id : `${base.id}-${i}`,
      hue: (base.hue + Math.floor(i / PROJECTS.length) * 47) % 360,
      seed: i * 9973 + 1,
      index: i,
    })
  }
  return out
}
