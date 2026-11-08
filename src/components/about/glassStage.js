'use client'

/*
 * Shared set-up for the site's black-glass 3D pieces (the orbit emblem, the products crate). Each one
 * draws on a fixed, full-window canvas behind the page and places itself on whichever of its anchor
 * elements is on screen, so the page's own layout and scroll animations decide where it goes.
 */

/** The Z from the Zed OS mark, in the logo's SVG units (y down). */
export const Z_POINTS = [
  [-62.3, -57.4], [84.9, -57.4], [-10.1, 28.7], [62.6, 28.7],
  [62.6, 57.7], [-84.1, 57.7], [11.5, -28.7], [-62.3, -28.7],
]

export const rad = (deg) => (deg * Math.PI) / 180

/** The brand orange (globals.css --brand), for 3D accents. */
export const BRAND = 0xfd551d

/**
 * Renderer, studio lighting and a camera where one unit at z = 0 is one CSS pixel. Resolves to null
 * when WebGL isn't available.
 */
export async function createGlassStage(canvas) {
  const [THREE, { RoomEnvironment }] = await Promise.all([
    import('three'),
    import('three/examples/jsm/environments/RoomEnvironment.js'),
  ])

  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  } catch {
    return null
  }
  const small = window.matchMedia('(max-width: 767px)').matches
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.NeutralToneMapping

  const scene = new THREE.Scene()
  // Black glass is mostly what it reflects: the room gives the soft highlights that shape it.
  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const environment = pmrem.fromScene(room, 0.03).texture
  room.dispose()
  pmrem.dispose()
  scene.environment = environment
  scene.environmentIntensity = 1.1
  const key = new THREE.DirectionalLight(0xffffff, 2.2)
  key.position.set(300, 500, 600)
  const rim = new THREE.DirectionalLight(0xffffff, 2.6)
  rim.position.set(-500, 200, -300)
  const under = new THREE.DirectionalLight(0xffffff, 0.8)
  under.position.set(200, -500, 200)
  scene.add(key, rim, under)

  const camera = new THREE.PerspectiveCamera(25, 1, 10, 20000)
  const view = { width: 0, height: 0 }
  const resize = () => {
    view.width = window.innerWidth
    view.height = window.innerHeight
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75))
    renderer.setSize(view.width, view.height, false)
    camera.aspect = view.width / view.height
    // Far enough back that one unit at z = 0 is one CSS pixel.
    camera.position.z = view.height / 2 / Math.tan(rad(camera.fov / 2))
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  // Pointer position across the window, -1 to 1 on each axis.
  const pointer = { x: 0, y: 0 }
  const onPointer = (event) => {
    pointer.x = (event.clientX / view.width) * 2 - 1
    pointer.y = (event.clientY / view.height) * 2 - 1
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  // Black glass, and a lighter smoked glass with a faint oil-slick sheen.
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x050505,
    metalness: 0.15,
    roughness: 0.07,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    ior: 1.5,
    specularIntensity: 1,
  })
  const smoke = new THREE.MeshPhysicalMaterial({
    color: 0x4a4a4a,
    metalness: 0.1,
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    iridescence: 0.45,
    iridescenceIOR: 1.6,
  })

  // A soft white glow, for sprites.
  const glowCanvas = document.createElement('canvas')
  glowCanvas.width = glowCanvas.height = 128
  const g = glowCanvas.getContext('2d')
  const gradient = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.25, 'rgba(255,255,255,0.35)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = gradient
  g.fillRect(0, 0, 128, 128)
  const glowTexture = new THREE.CanvasTexture(glowCanvas)
  glowTexture.colorSpace = THREE.SRGBColorSpace
  const glowMaterial = (opacity) =>
    new THREE.SpriteMaterial({ map: glowTexture, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending })

  return {
    THREE,
    renderer,
    scene,
    camera,
    view,
    pointer,
    small,
    materials: { glass, smoke },
    glowMaterial,
    dispose() {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      scene.traverse((node) => {
        node.geometry?.dispose()
        if (node.material && node.material !== glass && node.material !== smoke) node.material.dispose()
      })
      glass.dispose()
      smoke.dispose()
      glowTexture.dispose()
      environment.dispose()
      renderer.dispose()
    },
  }
}

/**
 * Tracks the anchors named by `attribute` (data-<attribute>="name"). Each frame, `update` picks the
 * first name in `order` with an anchor on screen (and passing `accept`), then eases the piece's
 * position and scale towards that anchor's box. `span` is the piece's width in its own units, which
 * the anchor's width is matched to. When no anchor shows, the scale eases to 0.
 */
export function createAnchorFollower({ attribute, order, span, accept = () => true, isReady = () => true }) {
  const selector = `[data-${attribute}]`
  const key = attribute.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  let byName = {}
  const refresh = () => {
    byName = {}
    for (const node of document.querySelectorAll(selector)) {
      ;(byName[node.dataset[key]] ||= []).push(node)
    }
  }
  refresh()
  window.addEventListener('resize', refresh)

  const state = { x: 0, y: 0, scale: 0, node: null, fresh: false }

  const pick = ({ width, height }) => {
    if (!isReady()) return null
    for (const name of order) {
      for (const node of byName[name] || []) {
        const rect = node.getBoundingClientRect()
        if (!rect.width || rect.bottom < 0 || rect.top > height || rect.right < 0 || rect.left > width) continue
        if (accept(name, rect, { width, height })) return { name, node, rect }
      }
    }
    return null
  }

  const update = (dt, view) => {
    const active = pick(view)
    let targetScale = 0
    state.fresh = false
    if (active) {
      const { rect, node } = active
      const tx = rect.left + rect.width / 2 - view.width / 2
      const ty = view.height / 2 - (rect.top + rect.height / 2)
      targetScale = rect.width / span
      // Appearing from nothing: start where it's going. Switching anchors: glide across.
      state.fresh = !state.node || state.scale < 0.01
      if (state.fresh) {
        state.x = tx
        state.y = ty
      }
      state.node = node
      const follow = 1 - Math.exp(-dt * 7)
      state.x += (tx - state.x) * follow
      state.y += (ty - state.y) * follow
    } else {
      state.node = null
    }
    state.scale += (targetScale - state.scale) * (1 - Math.exp(-dt * (targetScale ? 5 : 8)))
    return active
  }

  return {
    state,
    update,
    /** True once it has shrunk away with nothing to show. */
    get hidden() {
      return !state.node && state.scale < 0.004
    },
    dispose() {
      window.removeEventListener('resize', refresh)
    },
  }
}

/**
 * Calls `frame(dt, clock)` every animation frame, skipping frames while the site menu, the intro or a
 * page transition covers the screen. Returns a function that stops it.
 */
export function startLoop(frame) {
  let raf = 0
  let last = 0
  let clock = 0
  const tick = (now) => {
    raf = requestAnimationFrame(tick)
    const root = document.documentElement
    if (
      root.hasAttribute('data-menu-open') ||
      root.hasAttribute('data-intro-active') ||
      root.getAttribute('data-transition-phase') === 'holding'
    ) {
      last = now
      return
    }
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
    last = now
    clock += dt
    frame(dt, clock)
  }
  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}

/** Scroll speed in px per second, measured between calls. */
export function createScrollSpeed() {
  let last = window.scrollY
  return (dt) => {
    const now = window.scrollY
    const speed = (now - last) / dt
    last = now
    return speed
  }
}
