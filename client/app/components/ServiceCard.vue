<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import type { Component } from 'vue'
import { Flex } from '@/components/ui/layout'
import { Heading, Text } from '@/components/ui/typography'

const props = defineProps<{
  title: string
  description: string
  icon: Component
  path: string
  badge?: string
}>()

const router = useRouter()

const navigate = () => {
  router.push(props.path)
}
</script>

<template>
  <GlowCard class="h-full cursor-pointer group" @click="navigate">
    <Flex class="flex-col h-full p-6">
      <Flex class="items-start justify-between mb-6">
        <Flex class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform duration-300">
          <component :is="icon" class="w-6 h-6 text-orange-500" />
        </Flex>
        <Text v-if="badge" class="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-medium border border-orange-500/20">
          {{ badge }}
        </Text>
      </Flex>
      
      <Heading as="h3" class="text-xl font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors">
        {{ title }}
      </Heading>
      
      <Text class="text-zinc-400 text-sm leading-relaxed flex-grow">
        {{ description }}
      </Text>
      
      <Flex class="mt-6 items-center text-orange-500 font-medium text-sm">
        <Text>İncele</Text>
        <ArrowRight class="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
      </Flex>
    </Flex>
  </GlowCard>
</template>
