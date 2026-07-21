<script setup lang="ts">
import type { Component } from 'vue'
import GlowCard from './GlowCard.vue'
import { Flex } from '@/components/ui/layout'
import { Heading, Text } from '@/components/ui/typography'

defineProps<{
  title: string
  value: string
  icon?: Component
}>()
</script>

<template>
  <GlowCard class="h-full text-center">
    <Flex class="p-8 flex-col items-center justify-center h-full gap-4">
      <Flex v-if="icon" class="w-14 h-14 rounded-2xl bg-orange-500/10 items-center justify-center text-orange-500 mb-2">
        <component :is="icon" class="w-7 h-7" />
      </Flex>
      <Heading as="h3" class="text-zinc-400 font-medium">{{ title }}</Heading>
      <Text as="p" class="text-white text-lg font-semibold">{{ value }}</Text>
    </Flex>
  </GlowCard>
</template>
