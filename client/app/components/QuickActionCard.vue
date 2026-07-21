<script setup lang="ts">
import { NuxtLink } from '#components'
import type { Component } from 'vue'
import { Box, Flex } from '@/components/ui/layout'
import { Text } from '@/components/ui/typography'

const props = defineProps<{
  title: string
  icon: Component
  to?: string
}>()
</script>

<template>
  <component :is="to ? NuxtLink : Box" :to="to" class="block w-full">
    <GlowCard class="h-full group hover:scale-[1.02] hover:border-white/20 transition-all duration-300 cursor-pointer">
      <Flex class="p-6 flex-col items-center justify-center text-center gap-3">
        <Flex class="w-12 h-12 rounded-full bg-zinc-800/50 items-center justify-center text-orange-500 group-hover:bg-orange-500/10 group-hover:scale-110 transition-all duration-300 border border-white/5 group-hover:border-orange-500/20">
          <component :is="icon" class="w-6 h-6" />
        </Flex>
        <Text class="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{{ title }}</Text>
      </Flex>
    </GlowCard>
  </component>
</template>
