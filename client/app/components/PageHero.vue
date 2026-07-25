<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import { Section, Box, Flex } from '@/components/ui/layout'
import { Heading, Text } from '@/components/ui/typography'

interface Props {
  title: string
  description?: string
  badge?: string
}

defineProps<Props>()
</script>

<template>
  <Section class="relative w-full pt-32 pb-16 overflow-hidden grid-pattern border-b border-white/5">
    <Box class="hero-glow absolute inset-0 -z-10 opacity-70" />
    <Flex class="mx-auto max-w-7xl px-6 relative z-10 flex-col items-center text-center">
      <Badge v-if="badge" variant="outline" class="mb-6 bg-white/5 border-white/10 text-white/80 backdrop-blur-md hover:bg-white/10 transition-colors">
        {{ badge }}
      </Badge>
      <Heading as="h1" class="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
        {{ title }}
      </Heading>
      <Text as="p" v-if="description" class="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
        {{ description }}
      </Text>
    </Flex>
  </Section>
</template>

<style scoped>
.grid-pattern {
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center top;
}
.hero-glow {
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, transparent 60%);
}
</style>
