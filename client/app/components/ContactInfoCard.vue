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
  <GlowCard class="h-full">
    <Flex class="p-5 items-center h-full gap-4">
      <Flex v-if="icon" class="w-12 h-12 rounded-xl bg-white/5 items-center justify-center text-white flex-shrink-0">
        <component :is="icon" class="w-5 h-5" />
      </Flex>
      <Flex direction="col" gap="1">
        <Heading as="h3" class="text-zinc-400 text-sm font-medium">{{ title }}</Heading>
        <Text as="p" class="text-white text-base font-semibold">{{ value }}</Text>
      </Flex>
    </Flex>
  </GlowCard>
</template>
