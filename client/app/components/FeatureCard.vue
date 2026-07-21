<script setup lang="ts">
import type { Component } from 'vue'
import Box from '@/components/ui/layout/Box.vue'
import Flex from '@/components/ui/layout/Flex.vue'
import Heading from '@/components/ui/typography/Heading.vue'
import Text from '@/components/ui/typography/Text.vue'

interface Props {
  title: string
  description: string
  icon: Component
}

defineProps<Props>()
</script>

<template>
  <Flex 
    direction="col" 
    gap="4" 
    class="p-6 glass-card animate-in fade-in slide-in-from-bottom-4 duration-500 hover:-translate-y-1"
  >
    <Flex 
      align="center" 
      justify="center" 
      class="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 text-primary"
    >
      <component :is="icon" class="w-6 h-6" />
    </Flex>
    <Box>
      <Heading as="h3" size="h4" class="text-white mb-2">{{ title }}</Heading>
      <Text size="sm" variant="muted" class="leading-relaxed">{{ description }}</Text>
    </Box>
  </Flex>
</template>
