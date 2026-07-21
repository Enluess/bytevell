<script setup lang="ts">
import type { Component } from 'vue'
import GlowCard from './GlowCard.vue'
import { Box, Flex } from '@/components/ui/layout'
import { Heading, Text } from '@/components/ui/typography'

defineProps<{
  title: string
  value: string
  icon: Component
}>()
</script>

<template>
  <GlowCard>
    <Box class="p-6 relative overflow-hidden">
      <Flex class="justify-between items-start mb-4">
        <Heading as="h3" class="text-sm font-medium text-zinc-400">{{ title }}</Heading>
        <component :is="icon" class="w-5 h-5 text-zinc-500" />
      </Flex>
      <Text as="p" class="text-2xl font-bold text-white">{{ value }}</Text>
    </Box>
  </GlowCard>
</template>
