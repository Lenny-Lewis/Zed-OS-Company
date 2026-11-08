'use client'

import { useEffect, useRef } from 'react'
import { onIntroDone, MOTION_OK } from '@/components/about/motion'
import { createGlassStage, createAnchorFollower, startLoop, Z_POINTS, BRAND } from '@/components/about/glassStage'
import about from '@/components/about/About.module.css'

/*
 * A black-glass crate with the Z on its front, the Products page's 3D piece. Like the orbit emblem it
 * follows whichever anchor is on screen ([data-crate-anchor="hero|aisle|end"]). The anchor also sets
 * how far the lid is open (data-crate-open, 0 to 1), and every category in the quote
 * ([data-crate-page] data-quote-count) is an orange block that drops into it, bouncing to rest.
 */

const W = 320 // Outside width, height and depth, in the scene's units
const H = 160
const D = 240
const T = 12 // Wall thickness
const SPAN = 440 // About how wide the tilted crate looks; anchors are matched to it
const LID_OPEN = 1.95 // Radians the lid swings back when fully open
// How far it tips towards you: shut, you see the front and its Z; open, you look in at the floor.
const TIP_SHUT = 0.42
const TIP_OPEN = 0.88
const BLOCK = 78
// Resting places inside, in the order blocks are added: back row first, where they show best.
const SLOTS = [
  [-96, -50], [0, -50], [96, -50],
  [-96, 50], [0, 50], [96, 50],
]
const FLOOR = -H / 2 + T + BLOCK / 2
const DROP_FROM = 520
const GRAVITY = 2600
const BOUNCE = 0.32

export default function CrateScene() {
  const canvas = useRef(null)

  useEffect(() => {
    const el = canvas.current
    const page = el.closest('[data-crate-page]')
    if (!window.matchMedia(MOTION_OK).matches) return

    let disposed = false
    let stop = () => {}
    let introDone = false
    const stopIntroWatch = onIntroDone(() => {
      introDone = true
    })

    const start = async () => {
      const stage = await createGlassStage(el)
      if (!stage || disposed) return stage?.dispose()
      const { THREE, renderer, scene, camera, view, pointer, glowMaterial } = stage
      const { glass, smoke } = stage.materials
      const { RoundedBoxGeometry } = await import('three/examples/jsm/geometries/RoundedBoxGeometry.js')
      if (disposed) return stage.dispose()

      const panel = (w, h, d) => new RoundedBoxGeometry(w, h, d, 3, Math.min(w, h, d) * 0.4)
      // Quote blocks in glossy brand orange, bright against the black glass.
      const frost = new THREE.MeshPhysicalMaterial({
        color: BRAND,
        roughness: 0.28,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      })

      const piece = new THREE.Group() // Placed and scaled onto the active anchor
      const crate = new THREE.Group() // Tilted so you see in, sways with the pointer
      piece.add(crate)
      scene.add(piece)

      const backGlow = new THREE.Sprite(glowMaterial(0.08))
      backGlow.scale.set(SPAN * 1.6, SPAN * 1.6, 1)
      backGlow.position.z = -300
      piece.add(backGlow)

      const add = (geometry, material, x, y, z, parent = crate) => {
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, z)
        parent.add(mesh)
        return mesh
      }
      // Floor and four walls.
      add(panel(W, T, D), glass, 0, -H / 2 + T / 2, 0)
      add(panel(W, H, T), glass, 0, 0, D / 2 - T / 2)
      add(panel(W, H, T), glass, 0, 0, -D / 2 + T / 2)
      add(panel(T, H, D - 2 * T), smoke, -W / 2 + T / 2, 0, 0)
      add(panel(T, H, D - 2 * T), smoke, W / 2 - T / 2, 0, 0)

      // The Z on the front, in smoked glass.
      const zShape = new THREE.Shape(Z_POINTS.map(([x, y]) => new THREE.Vector2(x, -y)))
      const zGeometry = new THREE.ExtrudeGeometry(zShape, { depth: 6, bevelEnabled: true, bevelThickness: 2, bevelSize: 1.5, bevelSegments: 2 })
      const z = add(zGeometry, smoke, 0, 0, D / 2 + 1)
      z.scale.setScalar(0.62)

      // The lid hinges on the back top edge.
      const hinge = new THREE.Group()
      hinge.position.set(0, H / 2, -D / 2)
      crate.add(hinge)
      add(panel(W + 8, T, D + 8), glass, 0, T / 2, D / 2, hinge)

      // ---- Blocks for the quote ----
      const blockGeometry = panel(BLOCK, BLOCK, BLOCK)
      const blocks = SLOTS.map(([x, z]) => {
        const mesh = add(blockGeometry, frost, x, FLOOR, z)
        mesh.visible = false
        return { mesh, y: FLOOR, velocity: 0, state: 'empty', scale: 1, spin: 0 }
      })
      let shown = 0

      const fillTo = (count) => {
        const target = Math.min(count, blocks.length)
        while (shown < target) {
          const block = blocks[shown++]
          block.state = 'falling'
          block.y = FLOOR + DROP_FROM
          block.velocity = 0
          block.scale = 1
          block.spin = (Math.random() - 0.5) * 2.5
          block.mesh.visible = true
        }
        while (shown > target) {
          const block = blocks[--shown]
          block.state = 'leaving'
        }
      }

      // ---- Following anchors ----
      const follower = createAnchorFollower({
        attribute: 'crate-anchor',
        order: ['end', 'aisle', 'hero'],
        span: SPAN,
        isReady: () => introDone,
        accept: (name, rect, { width, height }) =>
          name !== 'end' || (rect.top + rect.height / 2 < height * 0.85 && rect.left + rect.width / 2 < width),
      })
      const lid = { open: 0 }
      let cleared = true

      const stopLoop = startLoop((dt, clock) => {
        const active = follower.update(dt, view)
        fillTo(parseInt(page?.dataset.quoteCount || '0', 10) || 0)

        // Blocks keep falling and settling even while it's hidden, so it's right when it returns.
        for (const block of blocks) {
          if (block.state === 'falling') {
            block.velocity -= GRAVITY * dt
            block.y += block.velocity * dt
            block.spin *= Math.exp(-dt * 3)
            if (block.y <= FLOOR) {
              block.y = FLOOR
              if (Math.abs(block.velocity) < 140) {
                block.state = 'resting'
                block.velocity = 0
              } else {
                block.velocity = -block.velocity * BOUNCE
              }
            }
          } else if (block.state === 'leaving') {
            block.y += 600 * dt
            block.scale -= dt * 3.5
            if (block.scale <= 0) {
              block.state = 'empty'
              block.mesh.visible = false
              block.y = FLOOR
              block.scale = 1
            }
          }
          if (block.state !== 'empty') {
            block.mesh.position.y = block.y
            block.mesh.scale.setScalar(Math.max(0, block.scale))
            block.mesh.rotation.y += block.spin * dt
            if (block.state === 'resting') block.mesh.rotation.y *= Math.exp(-dt * 4)
          }
        }

        if (follower.hidden) {
          if (!cleared) {
            renderer.clear()
            cleared = true
          }
          return
        }
        cleared = false
        const { state } = follower
        piece.position.set(state.x, state.y, 0)
        piece.scale.setScalar(state.scale)

        if (active) {
          const target = Math.min(1, Math.max(0, parseFloat(active.node.dataset.crateOpen || '0') || 0))
          if (state.fresh) lid.open = target
          lid.open += (target - lid.open) * (1 - Math.exp(-dt * 6))
        }
        hinge.rotation.x = -lid.open * LID_OPEN

        // Tilted towards you so you can see in, swaying, and leaning with the pointer.
        const ease = 1 - Math.exp(-dt * 3)
        const tip = TIP_SHUT + (TIP_OPEN - TIP_SHUT) * lid.open
        crate.rotation.x += (tip + pointer.y * 0.12 + Math.sin(clock * 0.5) * 0.03 - crate.rotation.x) * ease
        crate.rotation.y += (-0.55 + pointer.x * 0.3 + Math.sin(clock * 0.35) * 0.08 - crate.rotation.y) * ease
        // Shift down a little so the open lid fits inside the anchor's box.
        crate.position.y = -H * 0.18

        renderer.render(scene, camera)
      })

      stop = () => {
        stopLoop()
        follower.dispose()
        stage.dispose()
      }
    }

    start().catch((error) => console.error(error))

    return () => {
      disposed = true
      stopIntroWatch()
      stop()
    }
  }, [])

  return <canvas ref={canvas} className={about.orbitCanvas} aria-hidden="true" />
}
