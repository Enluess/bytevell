<template>
  <Section :class="cn('py-24', variantClasses, $props.class)">
    <Box v-if="variant === 'gradient'" class="hero-glow absolute inset-0 -z-10 opacity-50" />
    <Container class="mx-auto max-w-7xl px-6 relative z-10">
      <slot />
    </Container>
  </Section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/lib/utils'
import { Section, Box, Container } from '@/components/ui/layout'

interface Props {
  variant?: 'default' | 'muted' | 'gradient'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'muted':
      return 'border-t border-white/5 bg-zinc-950/50'
    case 'gradient':
      return 'section-glow relative overflow-hidden'
    default:
      return ''
  }
})
</script>

<style scoped>
.section-glow {
  position: relative;
}
.hero-glow {
  background: radial-gradient(circle at center, rgba(255, 144, 0, 0.15) 0%, transparent 60%);
}
</style>
