<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  as?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  class: ''
})

const computedClass = computed(() => {
  return props.class
})
</script>

<template>
  <component :is="as" :class="computedClass">
    <slot />
  </component>
</template>
