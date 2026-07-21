<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
  align?: 'left' | 'center' | 'right'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'h2',
  weight: 'bold',
  align: 'left',
  class: ''
})

// If size is not provided, fallback to the 'as' element
const computedSize = computed(() => props.size || props.as)

const headingClass = computed(() => {
  return cn(
    'tracking-tight text-foreground',
    {
      'text-4xl sm:text-5xl md:text-6xl lg:text-7xl': computedSize.value === 'h1',
      'text-3xl sm:text-4xl md:text-5xl': computedSize.value === 'h2',
      'text-2xl sm:text-3xl md:text-4xl': computedSize.value === 'h3',
      'text-xl sm:text-2xl md:text-3xl': computedSize.value === 'h4',
      'text-lg sm:text-xl md:text-2xl': computedSize.value === 'h5',
      'text-base sm:text-lg md:text-xl': computedSize.value === 'h6',
      
      'font-normal': props.weight === 'normal',
      'font-medium': props.weight === 'medium',
      'font-semibold': props.weight === 'semibold',
      'font-bold': props.weight === 'bold',
      'font-extrabold': props.weight === 'extrabold',
      
      'text-left': props.align === 'left',
      'text-center': props.align === 'center',
      'text-right': props.align === 'right',
    },
    props.class
  )
})
</script>

<template>
  <component :is="as" :class="headingClass">
    <slot />
  </component>
</template>
