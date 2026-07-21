<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { Flex } from '@/components/ui/layout'
import { Heading, Text } from '@/components/ui/typography'
import { Button } from '~/components/ui/button'

const props = withDefaults(defineProps<{
  name: string
  specs: string[]
  price: string
  buyLink?: string
}>(), {
  buyLink: '/auth/register'
})

const router = useRouter()
</script>

<template>
  <Flex class="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 lg:p-6 hover:border-orange-500/30 hover:bg-zinc-900/80 transition-all duration-300 group flex-col lg:flex-row lg:items-center justify-between gap-6">
    <Flex class="items-center gap-4 lg:w-1/4">
      <Flex class="w-10 h-10 rounded-xl bg-zinc-800 items-center justify-center text-xl border border-white/10 group-hover:border-orange-500/50 transition-colors">
        🇩🇪
      </Flex>
      <Heading as="h3" class="text-lg font-bold text-white">{{ name }}</Heading>
    </Flex>

    <Flex class="flex-wrap lg:flex-nowrap items-center gap-2 lg:gap-4 lg:w-1/2">
      <Text as="span" v-for="(spec, index) in specs" :key="index" class="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/5 text-zinc-300 text-xs font-medium whitespace-nowrap">
        {{ spec }}
      </Text>
    </Flex>

    <Flex class="items-center justify-between lg:justify-end gap-6 lg:w-1/4">
      <Flex class="flex-col items-end">
        <Text as="span" class="text-2xl font-bold text-white">{{ price }}</Text>
      </Flex>
      <Button class="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors focus:ring-2 focus:ring-orange-500/50 shadow-lg shadow-orange-500/20" @click="router.push(buyLink)">
        Satın Al
      </Button>
    </Flex>
  </Flex>
</template>
