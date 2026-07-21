<script setup lang="ts">
import { Box } from '@/components/ui/layout'
import { Heading } from '@/components/ui/typography'

defineProps<{
  title: string
}>()
</script>

<template>
  <Box class="max-w-3xl mx-auto py-12 px-4 sm:px-6">
    <Heading as="h1" class="text-4xl font-bold text-white mb-8 tracking-tight">{{ title }}</Heading>
    <Box class="prose prose-invert max-w-none prose-headings:text-white prose-p:text-zinc-400 prose-a:text-orange-500 hover:prose-a:text-orange-400 prose-strong:text-white prose-li:text-zinc-400">
      <slot />
    </Box>
  </Box>
</template>

<style>
/* Add any custom prose styles here if needed beyond what Tailwind typography provides */
.prose h2 {
  @apply text-2xl font-bold mt-10 mb-4 border-b border-white/10 pb-2;
}
.prose h3 {
  @apply text-xl font-semibold mt-8 mb-3;
}
</style>
