<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import Box from './Box.vue'

interface Props {
  as?: string
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  gap?: string | number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  direction: 'row',
  align: 'stretch',
  justify: 'start',
  wrap: 'nowrap',
  gap: 0,
  class: ''
})

const flexClass = computed(() => {
  return cn(
    'flex',
    {
      'flex-row': props.direction === 'row',
      'flex-col': props.direction === 'col',
      'flex-row-reverse': props.direction === 'row-reverse',
      'flex-col-reverse': props.direction === 'col-reverse',
      
      'items-start': props.align === 'start',
      'items-center': props.align === 'center',
      'items-end': props.align === 'end',
      'items-baseline': props.align === 'baseline',
      'items-stretch': props.align === 'stretch',
      
      'justify-start': props.justify === 'start',
      'justify-center': props.justify === 'center',
      'justify-end': props.justify === 'end',
      'justify-between': props.justify === 'between',
      'justify-around': props.justify === 'around',
      'justify-evenly': props.justify === 'evenly',
      
      'flex-nowrap': props.wrap === 'nowrap',
      'flex-wrap': props.wrap === 'wrap',
      'flex-wrap-reverse': props.wrap === 'wrap-reverse',
    },
    props.gap ? `gap-${props.gap}` : '',
    props.class
  )
})
</script>

<template>
  <Box :as="as" :class="flexClass">
    <slot />
  </Box>
</template>
