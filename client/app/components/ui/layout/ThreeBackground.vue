<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let animationFrameId: number

// Variables for mouse interaction
let mouseX = 0
let mouseY = 0

// Track window dimensions properly
let windowHalfX = 0
let windowHalfY = 0

const onDocumentMouseMove = (event: MouseEvent) => {
  mouseX = (event.clientX - windowHalfX) * 0.5
  mouseY = (event.clientY - windowHalfY) * 0.5
}

const handleResize = () => {
  if (!camera || !renderer) return
  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  if (!canvasRef.value || typeof window === 'undefined') return

  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2

  // Initialization
  scene = new THREE.Scene()
  
  // A dark, modern fog to blend into the background
  scene.fog = new THREE.FogExp2(0x000000, 0.002)

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 300

  renderer = new THREE.WebGLRenderer({ 
    canvas: canvasRef.value, 
    alpha: true, 
    antialias: true 
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  // Create particles
  const particleCount = 150
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const velocities: THREE.Vector3[] = []

  const r = 600
  const rHalf = r / 2

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = Math.random() * r - rHalf
    positions[i * 3 + 1] = Math.random() * r - rHalf
    positions[i * 3 + 2] = Math.random() * r - rHalf

    velocities.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.3
    ))
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const pMaterial = new THREE.PointsMaterial({
    color: 0x3b82f6, // Primary blue
    size: 2.5,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  })

  const particles = new THREE.Points(geometry, pMaterial)
  scene.add(particles)

  // Create lines connecting particles
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  })

  const lineGeometry = new THREE.BufferGeometry()
  // maximum possible connections: particleCount * particleCount (way more than needed, but safe)
  const maxConnections = particleCount * particleCount
  const linePositions = new Float32Array(maxConnections * 3)
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage))
  
  const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial)
  scene.add(linesMesh)

  document.addEventListener('mousemove', onDocumentMouseMove)
  window.addEventListener('resize', handleResize)

  // Animation Loop
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)

    // Smooth camera movement (Parallax)
    camera.position.x += (mouseX - camera.position.x) * 0.02
    camera.position.y += (-mouseY - camera.position.y) * 0.02
    camera.lookAt(scene.position)

    const positionsAttr = geometry.attributes.position.array as Float32Array
    let vertexpos = 0
    let numConnected = 0

    // Move particles
    for (let i = 0; i < particleCount; i++) {
      positionsAttr[i * 3] += velocities[i].x
      positionsAttr[i * 3 + 1] += velocities[i].y
      positionsAttr[i * 3 + 2] += velocities[i].z

      if (positionsAttr[i * 3] > rHalf || positionsAttr[i * 3] < -rHalf) velocities[i].x *= -1
      if (positionsAttr[i * 3 + 1] > rHalf || positionsAttr[i * 3 + 1] < -rHalf) velocities[i].y *= -1
      if (positionsAttr[i * 3 + 2] > rHalf || positionsAttr[i * 3 + 2] < -rHalf) velocities[i].z *= -1

      // Check distances to draw lines
      for (let j = i + 1; j < particleCount; j++) {
        const dx = positionsAttr[i * 3] - positionsAttr[j * 3]
        const dy = positionsAttr[i * 3 + 1] - positionsAttr[j * 3 + 1]
        const dz = positionsAttr[i * 3 + 2] - positionsAttr[j * 3 + 2]
        const distSq = dx * dx + dy * dy + dz * dz

        const minDistance = 80 // Max connection distance
        if (distSq < minDistance * minDistance) {
          linePositions[vertexpos++] = positionsAttr[i * 3]
          linePositions[vertexpos++] = positionsAttr[i * 3 + 1]
          linePositions[vertexpos++] = positionsAttr[i * 3 + 2]

          linePositions[vertexpos++] = positionsAttr[j * 3]
          linePositions[vertexpos++] = positionsAttr[j * 3 + 1]
          linePositions[vertexpos++] = positionsAttr[j * 3 + 2]
          
          numConnected++
        }
      }
    }

    geometry.attributes.position.needsUpdate = true
    
    lineGeometry.setDrawRange(0, numConnected * 2)
    lineGeometry.attributes.position.needsUpdate = true

    // Slow ambient rotation
    particles.rotation.y += 0.0005
    linesMesh.rotation.y += 0.0005

    renderer.render(scene, camera)
  }

  animate()
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (renderer) renderer.dispose()
  if (typeof document !== 'undefined') {
    document.removeEventListener('mousemove', onDocumentMouseMove)
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<template>
  <canvas 
    ref="canvasRef" 
    class="fixed inset-0 w-full h-full pointer-events-none z-[-1] opacity-40 transition-opacity duration-1000"
  ></canvas>
</template>
