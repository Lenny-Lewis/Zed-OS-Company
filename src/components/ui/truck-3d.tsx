"use client"

import * as React from "react"

/*
 * A 3D delivery truck driving along a road, drawn on a transparent canvas. The model is Kenney's
 * Car Kit "delivery" (CC0, public/models/truck/License.txt), repainted here so the source file stays
 * as downloaded. three.js only loads once the truck is about to come on screen, and the canvas only
 * draws while it's visible.
 */

const MODEL = "/models/truck/delivery.glb"
const PAINT = [
  [253, 85, 29], // the site's orange
  [233, 228, 218], // the footer's bone
]
/** World units visible from the bottom to the top of the canvas */
const VIEW_HEIGHT = 2.1
const LAP_SECONDS = 13
const PAUSE_SECONDS = 1.4
/** Turns the nose toward the viewer, enough to see it's 3D without losing the lettering */
const YAW = 0.42
const TILT = 0.2
const TRUCK_LENGTH = 3.25
const WHEEL_RADIUS = 0.3
const GROUND_MARGIN = 0.26

/** The model's texture is a small palette: repaint its green with `rgb`, keeping the shading. */
function repaint(source: CanvasImageSource & { width: number; height: number }, rgb: number[]) {
  const canvas = document.createElement("canvas")
  canvas.width = source.width
  canvas.height = source.height
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(source, 0, 0)
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const d = image.data
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 1] > d[i] + 18 && d[i + 1] > d[i + 2] + 8) {
      const shade = Math.min(1.15, d[i + 1] / 190)
      d[i] = Math.min(255, rgb[0] * shade)
      d[i + 1] = Math.min(255, rgb[1] * shade)
      d[i + 2] = Math.min(255, rgb[2] * shade)
    }
  }
  ctx.putImageData(image, 0, 0)
  return canvas
}

/** The lettering on the side of the cargo box */
function lettering() {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  ctx.fillStyle = "#0a0a0a"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.font = '700 228px "Archivo", sans-serif'
  ctx.fillText("ZED OS", 512, 212, 940)
  ctx.font = '600 50px "Archivo", sans-serif'
  ctx.fillText("SUPPLY CHAIN · SOFTWARE · SYSTEMS", 512, 384, 900)
  return canvas
}

export function Truck3D({ className = "" }: { className?: string }) {
  const host = React.useRef<HTMLDivElement>(null)
  const canvas = React.useRef<HTMLCanvasElement>(null)
  const toggle = React.useRef<() => void>(() => {})

  React.useEffect(() => {
    const box = host.current
    const el = canvas.current
    if (!box || !el) return

    let disposed = false
    let stop = () => {}

    const start = async () => {
      const [THREE, { GLTFLoader }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/GLTFLoader.js"),
        document.fonts?.load('700 228px "Archivo"').catch(() => undefined),
      ])
      if (disposed) return

      let renderer: import("three").WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: true, powerPreference: "low-power" })
      } catch {
        return // No WebGL: the road line stays and the footer is otherwise complete.
      }
      renderer.setClearColor(0x000000, 0)

      const scene = new THREE.Scene()
      scene.add(new THREE.HemisphereLight(0xffffff, 0x2a2a2a, 1.5))
      const key = new THREE.DirectionalLight(0xffffff, 2.3)
      key.position.set(3, 6, 7)
      scene.add(key)
      const rim = new THREE.DirectionalLight(0xffffff, 1.2)
      rim.position.set(-6, 3, -4)
      scene.add(rim)

      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 60)
      // Leaves room under the road, because the tilted view brings the nearest wheel lower on screen.
      const target = new THREE.Vector3(0, VIEW_HEIGHT / 2 - GROUND_MARGIN, 0)
      camera.position.set(0, target.y + Math.sin(TILT) * 20, Math.cos(TILT) * 20)
      camera.lookAt(target)

      const gltf = await new GLTFLoader().loadAsync(MODEL)
      if (disposed) {
        renderer.dispose()
        return
      }
      const truck = gltf.scene
      truck.rotation.y = Math.PI / 2 - YAW
      scene.add(truck)

      const wheels: { mesh: import("three").Object3D; rest: import("three").Quaternion }[] = []
      const textures: import("three").Texture[] = []
      truck.traverse((part) => {
        if (part.name.startsWith("wheel-")) wheels.push({ mesh: part, rest: part.quaternion.clone() })
      })

      // Repaint: one texture per colour, swapped on click.
      const body = truck.getObjectByName("body") as import("three").Mesh | undefined
      const bodyMaterial = body?.material as import("three").MeshStandardMaterial | undefined
      const original = bodyMaterial?.map ?? null
      const paints = original
        ? PAINT.map((rgb) => {
            const painted = repaint(original.image as HTMLImageElement, rgb)
            if (!painted) return original
            const texture = new THREE.CanvasTexture(painted)
            texture.colorSpace = THREE.SRGBColorSpace
            texture.flipY = original.flipY
            texture.magFilter = original.magFilter
            texture.minFilter = original.minFilter
            texture.needsUpdate = true
            textures.push(texture)
            return texture
          })
        : []
      let paint = 0
      const applyPaint = () => {
        // The door and any other part share the body's palette.
        truck.traverse((part) => {
          const material = (part as import("three").Mesh).material as import("three").MeshStandardMaterial | undefined
          if (material && material.map === original) material.map = paints[0] ?? original
        })
        if (bodyMaterial && paints[paint]) {
          bodyMaterial.map = paints[paint]
          bodyMaterial.needsUpdate = true
        }
      }
      applyPaint()

      const sign = lettering()
      let signMaterial: import("three").Material | null = null
      let signGeometry: import("three").BufferGeometry | null = null
      if (sign) {
        const texture = new THREE.CanvasTexture(sign)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = 4
        textures.push(texture)
        signMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })
        signGeometry = new THREE.PlaneGeometry(1.86, 0.93)
        const plane = new THREE.Mesh(signGeometry, signMaterial)
        plane.position.set(-0.752, 1.12, -0.62)
        plane.rotation.y = -Math.PI / 2
        truck.add(plane)
      }

      const AXIS_X = new THREE.Vector3(1, 0, 0)
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      let width = 0
      let height = 0
      let halfView = 1

      const place = (x: number, roll: number, time: number) => {
        truck.position.x = x
        truck.position.y = Math.sin(time * 15) * 0.005
        wheels.forEach(({ mesh, rest }) => {
          mesh.quaternion.setFromAxisAngle(AXIS_X, roll).multiply(rest)
        })
      }

      const resize = () => {
        width = box.clientWidth
        height = box.clientHeight
        if (!width || !height) return
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.setSize(width, height, false)
        const units = VIEW_HEIGHT
        halfView = ((width / height) * units) / 2
        camera.left = -halfView
        camera.right = halfView
        camera.top = units / 2
        camera.bottom = -units / 2
        camera.updateProjectionMatrix()
      }

      let x = 0
      let roll = 0
      let pause = 0
      let clock = 0
      const reach = () => halfView + TRUCK_LENGTH * 0.62

      const park = () => {
        // Clear of the centre text when nothing is allowed to move.
        place(-halfView + TRUCK_LENGTH * 0.62, 0, 0)
        renderer.render(scene, camera)
      }

      resize()
      x = -reach()
      if (reduced) park()

      toggle.current = () => {
        paint = (paint + 1) % PAINT.length
        applyPaint()
        if (reduced) park()
      }

      const ro = new ResizeObserver(() => {
        resize()
        if (reduced) park()
      })
      ro.observe(box)

      let raf = 0
      let last = 0
      const frame = (now: number) => {
        raf = requestAnimationFrame(frame)
        // Under the menu or the intro, the screen can't see it.
        const root = document.documentElement
        if (root.hasAttribute("data-menu-open") || root.hasAttribute("data-intro-active")) {
          last = now
          return
        }
        const dt = last ? Math.min(0.1, (now - last) / 1000) : 0
        last = now
        clock += dt
        if (pause > 0) {
          pause -= dt
        } else {
          const speed = (2 * reach()) / LAP_SECONDS
          x += speed * dt
          roll += (speed * dt) / WHEEL_RADIUS
          if (x > reach()) {
            x = -reach()
            pause = PAUSE_SECONDS
          }
        }
        place(x, roll, clock)
        renderer.render(scene, camera)
      }
      const io = new IntersectionObserver(([entry]) => {
        cancelAnimationFrame(raf)
        last = 0
        if (entry.isIntersecting && !reduced) raf = requestAnimationFrame(frame)
      })
      io.observe(box)

      stop = () => {
        cancelAnimationFrame(raf)
        io.disconnect()
        ro.disconnect()
        textures.forEach((t) => t.dispose())
        signMaterial?.dispose()
        signGeometry?.dispose()
        truck.traverse((part) => {
          const mesh = part as import("three").Mesh
          mesh.geometry?.dispose()
          const material = mesh.material as import("three").MeshStandardMaterial | undefined
          material?.map?.dispose()
          material?.dispose()
        })
        renderer.dispose()
      }
    }

    // Starts a screen early, so the truck is ready by the time the footer arrives.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        near.disconnect()
        start().catch((err) => console.error(err))
      },
      { rootMargin: "100% 0px" },
    )
    near.observe(box)

    return () => {
      disposed = true
      near.disconnect()
      stop()
    }
  }, [])

  return (
    <div
      ref={host}
      className={className}
      aria-hidden="true"
      onClick={() => toggle.current()}
    >
      <canvas ref={canvas} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  )
}

export default Truck3D
