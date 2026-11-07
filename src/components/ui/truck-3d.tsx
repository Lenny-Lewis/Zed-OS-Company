"use client"

import * as React from "react"

/*
 * A 3D delivery truck driving along a road, drawn on a transparent canvas. The model is "Truck" by
 * ROY (CC BY 4.0, public/models/truck/License.txt; the footer carries the required credit), painted
 * white here with the Zed logo on the box. three.js only loads once the truck is about to come on screen, and the canvas only draws
 * while it's visible.
 */

const MODEL = "/models/truck/truck.glb"
const PAINT = 0xf4f4f2
/** The black version of the mark, on a transparent background */
const LOGO = "/orbit-light-512.png"
/** World units visible from the bottom to the top of the canvas */
const VIEW_HEIGHT = 2.1
const LAP_SECONDS = 13
const PAUSE_SECONDS = 1.4
/** Turns the nose toward the viewer, enough to see it's 3D without losing the lettering */
const YAW = 0.3
const TILT = 0.2
const GROUND_MARGIN = 0.3
/** The model is 4.51 units tall, 15.9 long, with wheels of radius 0.695. */
const MODEL_SCALE = 0.333
const TRUCK_LENGTH = 15.9 * MODEL_SCALE
const WHEEL_RADIUS = 0.695 * MODEL_SCALE
/** Wheel sets are named Empty012_7 and so on. Empty_2 is the cab, so it has to stay out. */
const WHEEL_NODE = /^Empty\d+_/

export function Truck3D({ className = "" }: { className?: string }) {
  const host = React.useRef<HTMLDivElement>(null)
  const canvas = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const box = host.current
    const el = canvas.current
    if (!box || !el) return

    let disposed = false
    let stop = () => {}

    const start = async () => {
      const [THREE, { GLTFLoader }, { MeshoptDecoder }, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/GLTFLoader.js"),
        import("three/examples/jsm/libs/meshopt_decoder.module.js"),
        import("three/examples/jsm/environments/RoomEnvironment.js"),
      ])
      if (disposed) return

      let renderer: import("three").WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: true, powerPreference: "low-power" })
      } catch {
        return // No WebGL: the road line stays and the footer is otherwise complete.
      }
      renderer.setClearColor(0x000000, 0)
      // Neutral keeps the brand orange close to its real value, where filmic curves wash it out.
      renderer.toneMapping = THREE.NeutralToneMapping

      const scene = new THREE.Scene()
      // Paint and chrome read as real because of what they reflect, so this does most of the lighting.
      const pmrem = new THREE.PMREMGenerator(renderer)
      const room = new RoomEnvironment()
      const environment = pmrem.fromScene(room, 0.04).texture
      room.dispose()
      pmrem.dispose()
      scene.environment = environment
      // Kept low on purpose: any brighter and white paint clips to flat white, losing the panel shading.
      scene.environmentIntensity = 0.5
      const key = new THREE.DirectionalLight(0xffffff, 1.0)
      key.position.set(3, 6, 7)
      scene.add(key)
      const rim = new THREE.DirectionalLight(0xffffff, 0.5)
      rim.position.set(-6, 3, -4)
      scene.add(rim)

      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 60)
      // Leaves room under the road, because the tilted view brings the nearest wheel lower on screen.
      const target = new THREE.Vector3(0, VIEW_HEIGHT / 2 - GROUND_MARGIN, 0)
      camera.position.set(0, target.y + Math.sin(TILT) * 20, Math.cos(TILT) * 20)
      camera.lookAt(target)

      const loader = new GLTFLoader()
      loader.setMeshoptDecoder(MeshoptDecoder)
      const [gltf, logo] = await Promise.all([
        loader.loadAsync(MODEL),
        new THREE.TextureLoader().loadAsync(LOGO).catch(() => null), // A plain white truck is still fine.
      ])
      if (disposed) {
        logo?.dispose()
        environment.dispose()
        renderer.dispose()
        return
      }

      const model = gltf.scene
      model.updateWorldMatrix(true, true)
      model.position.y = -new THREE.Box3().setFromObject(model).min.y // Wheels on the road
      const truck = new THREE.Group()
      truck.add(model)
      truck.scale.setScalar(MODEL_SCALE)
      truck.rotation.y = Math.PI / 2 - YAW
      scene.add(truck)

      const cabPaint = new THREE.MeshPhysicalMaterial({ color: PAINT, roughness: 0.32, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08 })
      const boxPaint = new THREE.MeshPhysicalMaterial({ color: PAINT, roughness: 0.45, metalness: 0, clearcoat: 0.4, clearcoatRoughness: 0.2 })
      const windows = new THREE.MeshStandardMaterial({ color: 0x141b20, roughness: 0.06, metalness: 1 })
      const textures: import("three").Texture[] = []

      const wheels: { mesh: import("three").Object3D; rest: import("three").Quaternion; axis: import("three").Vector3 }[] = []
      const forward = new THREE.Vector3(1, 0, 0)
      model.traverse((part) => {
        if (WHEEL_NODE.test(part.name)) {
          // The file's nodes are rotated: this is the axle (the truck's X) in the wheel parent's own axes.
          const axis = part.parent
            ? forward.clone().transformDirection(part.parent.matrixWorld.clone().invert())
            : forward.clone()
          wheels.push({ mesh: part, rest: part.quaternion.clone(), axis })
        }
        const mesh = part as import("three").Mesh
        if (!mesh.isMesh) return
        const name = (mesh.material as import("three").Material).name
        if (name === "head_paint") mesh.material = cabPaint
        else if (name === "bodycolour") mesh.material = boxPaint
        else if (name === "windglass") mesh.material = windows
      })

      let signMaterial: import("three").Material | null = null
      let signGeometry: import("three").BufferGeometry | null = null
      if (logo) {
        logo.colorSpace = THREE.SRGBColorSpace
        logo.anisotropy = 8
        // Crops the PNG's empty margins down to the mark (x 67-443, y 133-377 of 512).
        logo.repeat.set(376 / 512, 244 / 512)
        logo.offset.set(67 / 512, 135 / 512)
        textures.push(logo)
        // Printed, not stuck on: the same paint as the box, so its white background is lit exactly like
        // the panel around it and disappears, and the ink catches the same sheen.
        const print = boxPaint.clone()
        print.map = logo
        signMaterial = print
        signGeometry = new THREE.PlaneGeometry(2.55, 1.655)
        const plane = new THREE.Mesh(signGeometry, signMaterial)
        // Centred on the box's flat side panel (x -1.40, y -0.66 to 2.12, z -7.69 to 4.34), just off
        // its surface and behind the frame around it.
        plane.position.set(-1.405, 0.73, -1.675)
        plane.rotation.y = -Math.PI / 2
        model.add(plane)
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      let width = 0
      let height = 0
      let halfView = 1

      const place = (x: number, roll: number, time: number) => {
        truck.position.x = x
        truck.position.y = Math.sin(time * 15) * 0.005
        wheels.forEach(({ mesh, rest, axis }) => {
          mesh.quaternion.setFromAxisAngle(axis, roll).multiply(rest)
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
        environment.dispose()
        truck.traverse((part) => {
          const mesh = part as import("three").Mesh
          mesh.geometry?.dispose()
          ;(mesh.material as import("three").Material | undefined)?.dispose()
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
    <div ref={host} className={className} aria-hidden="true">
      <canvas ref={canvas} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  )
}

export default Truck3D
