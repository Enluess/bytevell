<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number
let ctx: CanvasRenderingContext2D | null = null

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  drift: number
}

const particles: Particle[] = []
const PARTICLE_COUNT = 40

const initParticles = (w: number, h: number) => {
  particles.length = 0
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.3 + 0.05,
      drift: (Math.random() - 0.5) * 0.15
    })
  }
}

const resize = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  if (particles.length === 0) {
    initParticles(canvas.width, canvas.height)
  }
}

const animate = () => {
  if (!ctx || !canvasRef.value) return
  const { width, height } = canvasRef.value

  ctx.clearRect(0, 0, width, height)

  for (const p of particles) {
    // Slow upward drift — like data packets rising
    p.y -= p.speed
    p.x += p.drift

    // Reset when off screen
    if (p.y < -10) {
      p.y = height + 10
      p.x = Math.random() * width
    }
    if (p.x < -10) p.x = width + 10
    if (p.x > width + 10) p.x = -10

    // Draw particle
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
    ctx.fill()
  }

  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  if (!canvasRef.value || typeof window === 'undefined') return
  ctx = canvasRef.value.getContext('2d')
  resize()
  animate()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', resize)
  }
})
</script>

<template>
  <div class="bg-layer" aria-hidden="true">
    <!-- Dot-grid pattern -->
    <div class="grid-layer" />

    <!-- Animated particles canvas -->
    <canvas ref="canvasRef" class="particle-canvas" />

    <!-- Soft ambient glow -->
    <div class="glow glow-1" />
    <div class="glow glow-2" />
  </div>
</template>

<style scoped>
.bg-layer {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.grid-layer {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.5;
}

.particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  will-change: transform;
  animation: drift 30s ease-in-out infinite alternate;
}

.glow-1 {
  width: 500px;
  height: 500px;
  top: -10%;
  left: -5%;
  background: rgba(255, 255, 255, 0.02);
}

.glow-2 {
  width: 400px;
  height: 400px;
  bottom: -10%;
  right: -5%;
  background: rgba(255, 255, 255, 0.015);
  animation-delay: -10s;
  animation-duration: 35s;
}

@keyframes drift {
  0% { transform: translate(0, 0); }
  100% { transform: translate(20px, -15px); }
}
</style>
