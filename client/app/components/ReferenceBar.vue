<script setup lang="ts">
import { Users } from 'lucide-vue-next'
import Box from '@/components/ui/layout/Box.vue'
import Container from '@/components/ui/layout/Container.vue'
import Flex from '@/components/ui/layout/Flex.vue'
import Text from '@/components/ui/typography/Text.vue'

interface Reference {
  name: string
  count: string
}

interface Props {
  references: Reference[]
}

defineProps<Props>()
</script>

<template>
  <Box class="border-t border-white/5 py-8 bg-black">
    <Container size="lg">
      <Flex direction="col" class="md:flex-row items-center gap-8">
        <Text size="sm" weight="semibold" class="text-zinc-500 uppercase tracking-wider shrink-0">
          Bizi Tercih Edenler
        </Text>
        
        <Flex wrap="wrap" align="center" gap="4" class="w-full">
          <Flex 
            v-for="(ref, index) in references" 
            :key="index"
            align="center"
            gap="3"
            class="px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors animate-in fade-in slide-in-from-left-4 duration-500"
            :style="{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }"
          >
            <Flex align="center" justify="center" class="w-6 h-6 rounded-full bg-primary/20 text-primary shrink-0">
              <Text size="xs" weight="bold">{{ ref.name.charAt(0).toUpperCase() }}</Text>
            </Flex>
            <Text size="sm" weight="medium" class="text-white">{{ ref.name }}</Text>
            <Flex align="center" gap="1" class="ml-2 pl-2 border-l border-white/10 text-zinc-400">
              <Users class="w-3 h-3" />
              <Text size="xs">{{ ref.count }}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  </Box>
</template>
