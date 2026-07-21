<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  as?: 'p' | 'span' | 'div'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  variant?: 'default' | 'muted' | 'primary' | 'destructive'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  align?: 'left' | 'center' | 'right'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'p',
  size: 'base',
  variant: 'default',
  weight: 'normal',
  align: 'left',
  class: ''
})

const textClass = computed(() => {
  return cn(
    {
      'text-xs': props.size === 'xs',
      'text-sm': props.size === 'sm',
      'text-base': props.size === 'base',
      'text-lg': props.size === 'lg',
      'text-xl': props.size === 'xl',
      
      'text-foreground': props.variant === 'default',
      'text-muted-foreground': props.variant === 'muted',
      'text-primary': props.variant === 'primary',
      'text-destructive': props.variant === 'destructive',
      
      'font-normal': props.weight === 'normal',
      'font-medium': props.weight === 'medium',
      'font-semibold': props.weight === 'semibold',
      'font-bold': props.weight === 'bold',
      
      'text-left': props.align === 'left',
      'text-center': props.align === 'center',
      'text-right': props.align === 'right',
    },
    props.class
  )
})
</script>

<template>
  <component :is="as" :class="textClass">
    <slot />
  </component>
</template>
