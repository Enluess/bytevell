<template>
  <Flex :class="cn('flex-col gap-4 mb-16', alignClasses)">
    <Flex v-if="badge" :class="align === 'center' ? 'justify-center' : 'justify-start'">
      <Badge variant="secondary" class="bg-white/10 text-white hover:bg-white/20 transition-colors border-white/5">
        {{ badge }}
      </Badge>
    </Flex>
    <Heading as="h2" class="text-4xl md:text-5xl font-bold text-white tracking-tight">
      {{ title }}
    </Heading>
    <Text v-if="description" class="text-lg text-zinc-400 max-w-2xl" :class="align === 'center' ? 'mx-auto' : ''">
      {{ description }}
    </Text>
  </Flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'
import { Flex } from '@/components/ui/layout'
import { Heading, Text } from '@/components/ui/typography'

interface Props {
  title: string
  description?: string
  badge?: string
  align?: 'center' | 'left'
}

const props = withDefaults(defineProps<Props>(), {
  align: 'center',
})

const alignClasses = computed(() => {
  return props.align === 'center' ? 'text-center items-center' : 'text-left items-start'
})
</script>
