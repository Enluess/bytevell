<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import GlowCard from './GlowCard.vue'
import { Flex } from '@/components/ui/layout'
import { Text } from '@/components/ui/typography'

interface Props {
  features: string[]
}

defineProps<Props>()
</script>

<template>
  <GlowCard class="p-8">
    <Flex as="ul" class="flex-col gap-4">
      <Flex 
        as="li"
        v-for="(feature, index) in features" 
        :key="index"
        class="items-center gap-3 animate-fade-in-up"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <Flex class="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 items-center justify-center">
          <Check class="w-4 h-4 text-emerald-400" />
        </Flex>
        <Text as="span" class="text-sm text-zinc-300">{{ feature }}</Text>
      </Flex>
    </Flex>
  </GlowCard>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.4s ease forwards;
}
</style>
