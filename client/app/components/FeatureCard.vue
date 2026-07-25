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
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  index: 0
})
</script>

<template>
  <Flex 
    direction="col" 
    gap="5" 
    class="feature-card group p-7 glass-card reveal-on-scroll cursor-default h-full"
    :style="{ animationDelay: `${index * 120}ms` }"
  >
    <!-- Icon container -->
    <Flex 
      align="center" 
      justify="center" 
      class="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/[0.08] text-white/70 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:border-white/15"
    >
      <component :is="icon" class="w-6 h-6 transition-transform duration-500 group-hover:scale-110" />
    </Flex>

    <!-- Content -->
    <Box>
      <Heading as="h3" size="h4" class="text-white mb-2.5 transition-all duration-300">{{ title }}</Heading>
      <Text size="sm" variant="muted" class="leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300">{{ description }}</Text>
    </Box>

    <!-- Bottom accent line on hover - very subtle white -->
    <Box class="h-px w-0 group-hover:w-full bg-gradient-to-r from-white/20 to-transparent transition-all duration-500 rounded-full mt-auto" />
  </Flex>
</template>

<style scoped>
.feature-card {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 40px -10px rgba(255, 255, 255, 0.03);
}
</style>
