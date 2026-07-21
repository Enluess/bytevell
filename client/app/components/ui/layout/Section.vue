<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import Box from './Box.vue'

interface Props {
  variant?: 'default' | 'muted' | 'transparent'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'lg',
  class: ''
})

const sectionClass = computed(() => {
  return cn(
    'w-full relative',
    {
      'py-0': props.padding === 'none',
      'py-8 md:py-12': props.padding === 'sm',
      'py-12 md:py-16': props.padding === 'md',
      'py-16 md:py-24': props.padding === 'lg',
      'py-24 md:py-32': props.padding === 'xl',
      
      'bg-background': props.variant === 'default',
      'bg-muted/50': props.variant === 'muted',
      'bg-transparent': props.variant === 'transparent',
    },
    props.class
  )
})
</script>

<template>
  <Box as="section" :class="sectionClass">
    <slot />
  </Box>
</template>
