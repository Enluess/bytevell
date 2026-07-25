<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Server, Check } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { Flex } from '@/components/ui/layout'
import { Heading, Text } from '@/components/ui/typography'
import { Button } from '~/components/ui/button'

const props = withDefaults(defineProps<{
  name: string
  specs: string[]
  price: string
  type?: string
  buyLink?: string
}>(), {
  type: 'vps'
})

const router = useRouter()
const cartStore = useCartStore()

const added = ref(false)

const addToCart = () => {
  cartStore.addItem(props.type, props.name, props.price)
  added.value = true
  setTimeout(() => {
    added.value = false
  }, 2000)
}
</script>

<template>
  <Flex class="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 lg:p-6 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 group flex-col lg:flex-row lg:items-center justify-between gap-6">
    <Flex class="items-center gap-4 flex-shrink-0">
      <Flex class="w-10 h-10 rounded-xl bg-white/5 items-center justify-center text-white border border-white/10 group-hover:border-white/20 transition-colors">
        <Server class="w-5 h-5" />
      </Flex>
      <Heading as="h3" class="text-lg font-bold text-white">{{ name }}</Heading>
    </Flex>

    <Flex class="flex-wrap items-center justify-center gap-2 lg:gap-3 flex-1">
      <Text as="span" v-for="(spec, index) in specs" :key="index" class="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/5 text-zinc-300 text-xs font-medium whitespace-nowrap">
        {{ spec }}
      </Text>
    </Flex>

    <Flex class="items-center justify-between lg:justify-end gap-6 flex-shrink-0">
      <Flex class="flex-col items-end">
        <Text as="span" class="text-2xl font-bold text-white">{{ price }}</Text>
      </Flex>
      <Button 
        class="px-6 py-2.5 rounded-xl font-semibold transition-all focus:ring-2 focus:ring-white/50 shadow-lg shadow-white/10 w-32 justify-center"
        :class="added ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-white text-black hover:bg-zinc-200'" 
        @click="addToCart"
      >
        <span v-if="added" class="flex items-center gap-2"><Check class="w-4 h-4"/> Eklendi</span>
        <span v-else>Sepete Ekle</span>
      </Button>
    </Flex>
  </Flex>
</template>
