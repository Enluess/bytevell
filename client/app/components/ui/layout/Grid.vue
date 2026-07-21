<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import Box from './Box.vue'

interface Props {
  as?: string
  cols?: number | string
  gap?: string | number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  cols: 1,
  gap: 0,
  class: ''
})

const gridClass = computed(() => {
  return cn(
    'grid',
    // Using string matching/tailwind classes for standard columns. 
    // Usually handled via tailwind classes in parent, but providing shortcut
    !isNaN(Number(props.cols)) ? `grid-cols-${props.cols}` : props.cols,
    props.gap ? `gap-${props.gap}` : '',
    props.class
  )
})
</script>

<template>
  <Box :as="as" :class="gridClass">
    <slot />
  </Box>
</template>
