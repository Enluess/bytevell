<template>
  <Box class="border-t border-white/5 py-10 bg-black/50 backdrop-blur-sm">
    <Box class="mx-auto max-w-7xl px-6">
      <Grid class="grid-cols-2 md:grid-cols-4 gap-8">
        <Flex 
          v-for="(stat, index) in stats" 
          :key="index"
          class="flex-col items-center justify-center text-center space-y-2 animate-count-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <Text class="text-4xl md:text-5xl font-bold text-white tracking-tighter">{{ stat.value }}</Text>
          <Text class="text-sm font-medium text-zinc-500 uppercase tracking-wider">{{ stat.label }}</Text>
        </Flex>
      </Grid>
    </Box>
  </Box>
</template>

<script setup lang="ts">
import { Box, Grid, Flex } from '@/components/ui/layout'
import { Text } from '@/components/ui/typography'

interface Stat {
  value: string
  label: string
}

interface Props {
  stats: Stat[]
}

defineProps<Props>()
</script>

<style scoped>
@keyframes countUp {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-count-up {
  opacity: 0;
  animation: countUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
