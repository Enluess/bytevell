<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import Box from './Box.vue'

interface Props {
  as?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  size: 'lg',
  class: ''
})

const containerClass = computed(() => {
  return cn(
    'mx-auto w-full px-4 sm:px-6 lg:px-8',
    {
      'max-w-3xl': props.size === 'sm',
      'max-w-5xl': props.size === 'md',
      'max-w-7xl': props.size === 'lg',
      'max-w-screen-xl': props.size === 'xl',
      'max-w-screen-2xl': props.size === '2xl',
      'max-w-full': props.size === 'full',
    },
    props.class
  )
})
</script>

<template>
  <Box :as="as" :class="containerClass">
    <slot />
  </Box>
</template>
