'use client'

import { useEffect, useRef } from 'react'
import { onIntroDone, MOTION_OK } from './motion'
import { createGlassStage, createAnchorFollower, startLoop, createScrollSpeed, Z_POINTS, rad, BRAND } from './glassStage'
import styles from './About.module.css'

/*
 * The Zed OS orbit mark in black glass, the emblem of the About and Partner pages. It follows
 * whichever anchor is on screen ([data-orbit-anchor="hero|story|end"]): the anchor's box sets where
 * it is and how big. It glides from one anchor to the next and shrinks away when none is showing.
 *
 * Scrolling spins the rings, which spring back to the logo once you stop. Every timeline chapter
 * you pass ([data-chapter]) lights a dot that circles the Z. An anchor can also hold the rings apart
 * (data-orbit-apart, 1 = apart, 0 = the logo); as they meet they lock in with a flash and a spin.
 *
 * Geometry is the brand mark's own (see components/ui/zed-orbit-mark.tsx), in its SVG units with
 * y flipped. Instead of the logo's cut-outs, the rings lean out of the plane and really pass in
 * front of and behind the Z.
 */

const RX = 220.5
const RY = 81.45
const TILT = 28 // degrees; the ink ring leans up to the right, the grey ring down
const TUBE = 7.2
const DOT_R = 16.8
const MARK_WIDTH = 422 // The SVG's viewBox width, which anchors are sized against
const REST_ROLL = 0.42 // How far each ring leans out of the plane, in radians
const MILESTONES = 5
const ORBIT = 1.16 // Milestone dots' path, relative to the ring they circle with

export default function OrbitEmblem() {
  const canvas = useRef(null)

  useEffect(() => {
    const el = canvas.current
    const page = el.closest('[data-orbit-page]')
    const fallback = () => page?.setAttribute('data-orbit-fallback', '')

    if (!window.matchMedia(MOTION_OK).matches) {
      fallback()
      return
    }

    let disposed = false
    let stop = () => {}
    let introDone = false
    const stopIntroWatch = onIntroDone(() => {
      introDone = true
    })

    const start = async () => {
      const stage = await createGlassStage(el)
      if (!stage) return fallback()
      if (disposed) return stage.dispose()
      const { THREE, renderer, scene, camera, view, pointer, small, glowMaterial } = stage
      const { glass, smoke } = stage.materials
      // Milestone dots glow in the brand orange.
      const light = new THREE.MeshBasicMaterial({ color: BRAND })

      // ---- Geometry ----
      const zShape = new THREE.Shape(Z_POINTS.map(([x, y]) => new THREE.Vector2(x, -y)))
      const zGeometry = new THREE.ExtrudeGeometry(zShape, {
        depth: 22,
        bevelEnabled: true,
        bevelThickness: 5,
        bevelSize: 3.5,
        bevelSegments: 4,
        curveSegments: 1,
      })
      zGeometry.translate(0, 0, -11)

      class Ellipse extends THREE.Curve {
        getPoint(t, target = new THREE.Vector3()) {
          const a = t * Math.PI * 2
          return target.set(RX * Math.cos(a), RY * Math.sin(a), 0)
        }
      }
      const ringGeometry = new THREE.TubeGeometry(new Ellipse(), small ? 140 : 240, TUBE, small ? 12 : 20, true)
      const dotGeometry = new THREE.SphereGeometry(1, 32, 16)

      const emblem = new THREE.Group() // Placed and scaled onto the active anchor
      const mark = new THREE.Group() // Tilts with the pointer and sways
      emblem.add(mark)
      scene.add(emblem)

      // Faint light behind the glass, so the black mark separates from the black page.
      const backGlow = new THREE.Sprite(glowMaterial(0.07))
      backGlow.scale.set(MARK_WIDTH * 1.5, MARK_WIDTH * 1.5, 1)
      backGlow.position.z = -160
      mark.add(backGlow)

      const zMesh = new THREE.Mesh(zGeometry, glass)
      mark.add(zMesh)

      const rings = [
        { tilt: TILT, material: glass, rest: REST_ROLL, spin: 1 },
        { tilt: -TILT, material: smoke, rest: -REST_ROLL, spin: -1 },
      ].map((ring) => {
        const pivot = new THREE.Group()
        pivot.rotation.z = rad(ring.tilt)
        const roll = new THREE.Group() // Turns about the ring's long axis
        roll.rotation.x = ring.rest
        roll.add(new THREE.Mesh(ringGeometry, ring.material))
        pivot.add(roll)
        mark.add(pivot)
        return { ...ring, pivot, roll, angle: ring.rest, velocity: 0 }
      })

      // The logo's own dot, resting at the grey ring's far tip.
      const baseDot = new THREE.Mesh(dotGeometry, glass)
      baseDot.scale.setScalar(DOT_R)
      baseDot.position.set(RX, 0, 0)
      rings[1].roll.add(baseDot)

      // Milestone dots, shared out between the rings.
      const dots = Array.from({ length: MILESTONES }, (_, i) => {
        const holder = new THREE.Group()
        const ball = new THREE.Mesh(dotGeometry, light)
        ball.scale.setScalar(7)
        const halo = new THREE.Sprite(glowMaterial(0.9))
        halo.material.color.set(BRAND)
        halo.scale.set(80, 80, 1)
        holder.add(ball, halo)
        holder.scale.setScalar(0)
        rings[i % 2].roll.add(holder)
        return { holder, halo, phase: (i * Math.PI * 2) / MILESTONES + i * 0.4, shown: 0 }
      })

      // ---- Following anchors ----
      const follower = createAnchorFollower({
        attribute: 'orbit-anchor',
        order: ['end', 'story', 'hero'], // Earlier wins when several are on screen
        span: MARK_WIDTH,
        isReady: () => introDone,
        // The end card takes over only once it's well into view, not as it peeks in.
        accept: (name, rect, { width, height }) =>
          name !== 'end' || (rect.left + rect.width / 2 < width * 0.8 && rect.top + rect.height / 2 < height * 0.85),
      })
      const chapters = Array.from(document.querySelectorAll('[data-chapter]'))
      const scrollSpeed = createScrollSpeed()
      const apartState = { value: 0, flash: 0 }
      let cleared = true

      const stopLoop = startLoop((dt, clock) => {
        const active = follower.update(dt, view)
        const speed = scrollSpeed(dt)
        if (follower.hidden) {
          if (!cleared) {
            renderer.clear()
            cleared = true
          }
          return
        }
        cleared = false
        const { state } = follower
        emblem.position.set(state.x, state.y, 0)
        emblem.scale.setScalar(state.scale)

        // Pointer tilt and a slow sway.
        const ease = 1 - Math.exp(-dt * 3)
        mark.rotation.y += (pointer.x * 0.35 + Math.sin(clock * 0.35) * 0.12 - mark.rotation.y) * ease
        mark.rotation.x += (pointer.y * 0.22 + Math.sin(clock * 0.5) * 0.05 - mark.rotation.x) * ease

        // Scroll spins the rings; once it stops they settle back into the logo. A ring looks the same
        // turned half way round its long axis, so it settles on the nearest of those rests.
        const scrolling = Math.abs(speed) > 40
        for (const ring of rings) {
          if (scrolling) {
            const drive = Math.max(-9, Math.min(9, speed * 0.004)) * ring.spin
            ring.velocity += (drive - ring.velocity) * (1 - Math.exp(-dt * 4))
          } else {
            const rest = ring.rest + Math.round((ring.angle - ring.rest) / Math.PI) * Math.PI
            ring.velocity += ((rest - ring.angle) * 14 - ring.velocity * 5.5) * dt
          }
          ring.angle += ring.velocity * dt
          ring.roll.rotation.x = ring.angle
        }

        // Partnership: rings held apart by the anchor, locking in as they meet.
        if (active) {
          const target = Math.min(1, Math.max(0, parseFloat(active.node.dataset.orbitApart || '0') || 0))
          if (state.fresh) apartState.value = target
          const before = apartState.value
          apartState.value += (target - apartState.value) * (1 - Math.exp(-dt * 10))
          if (before > 0.06 && apartState.value <= 0.06) {
            apartState.flash = 1
            rings.forEach((ring) => {
              ring.velocity += 7 * ring.spin
            })
          }
        }
        const apart = apartState.value
        rings.forEach((ring, i) => {
          const side = i === 0 ? -1 : 1
          ring.pivot.position.set(side * apart * RX * 0.95, -side * apart * 46, apart * -60)
          ring.pivot.rotation.z = rad(ring.tilt) + side * apart * 0.55
        })
        zMesh.scale.setScalar(1 - apart * 0.5)
        zMesh.rotation.y = apart * Math.PI * 0.75
        apartState.flash *= Math.exp(-dt * 2.2)
        backGlow.material.opacity = 0.07 + apartState.flash * 0.4

        // Milestones: one dot for each chapter that has come well into view.
        let lit = 0
        for (const chapter of chapters) {
          const rect = chapter.getBoundingClientRect()
          if (rect.left < view.width * 0.6 && rect.top < view.height * 0.6) lit++
        }
        const orbitSpeed = 0.45 + Math.min(2, Math.abs(rings[0].velocity) * 0.15)
        dots.forEach((dot, i) => {
          const target = i < lit ? 1 : 0
          dot.shown += (target - dot.shown) * (1 - Math.exp(-dt * 6))
          // A small overshoot as it pops in.
          const pop = dot.shown * (1 + 0.25 * Math.sin(Math.min(1, dot.shown) * Math.PI))
          dot.holder.scale.setScalar(pop)
          dot.phase += dt * orbitSpeed * (i % 2 ? -1 : 1)
          // Just outside the ring, so each reads as a satellite rather than a band on the tube.
          dot.holder.position.set(ORBIT * RX * Math.cos(dot.phase), ORBIT * RY * Math.sin(dot.phase), 0)
          dot.halo.material.opacity = 0.65 + Math.sin(clock * 3 + i) * 0.25
        })

        renderer.render(scene, camera)
      })

      stop = () => {
        stopLoop()
        follower.dispose()
        stage.dispose()
      }
    }

    start().catch((error) => {
      console.error(error)
      fallback()
    })

    return () => {
      disposed = true
      stopIntroWatch()
      stop()
    }
  }, [])

  return <canvas ref={canvas} className={styles.orbitCanvas} aria-hidden="true" />
}
