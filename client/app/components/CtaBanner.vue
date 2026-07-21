<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import Section from '@/components/ui/layout/Section.vue'
import Container from '@/components/ui/layout/Container.vue'
import Flex from '@/components/ui/layout/Flex.vue'
import Box from '@/components/ui/layout/Box.vue'
import Heading from '@/components/ui/typography/Heading.vue'
import Text from '@/components/ui/typography/Text.vue'
import { Button } from '@/components/ui/button'

interface Props {
  title: string
  primaryText: string
  primaryLink: string
  secondaryText?: string
  secondaryLink?: string
}

defineProps<Props>()
</script>

<template>
  <Section padding="xl" class="text-center section-glow border-t border-white/5 relative overflow-hidden">
    <Box class="hero-glow absolute inset-0 -z-10 opacity-60" />
    <Container size="md" class="relative z-10">
      <Flex direction="col" align="center" gap="10">
        <Heading as="h2" size="h1" class="text-white tracking-tight leading-tight">
          {{ title }}
        </Heading>
        
        <Flex direction="col" class="sm:flex-row items-center gap-6">
          <Button size="lg" asChild class="px-8 h-12 text-base font-medium shadow-lg shadow-white/10 hover:scale-105 transition-transform">
            <NuxtLink :to="primaryLink">
              {{ primaryText }}
              <ArrowRight class="ml-2 w-4 h-4" />
            </NuxtLink>
          </Button>
          
          <Button v-if="secondaryText && secondaryLink" variant="ghost" size="lg" asChild class="text-zinc-400 hover:text-white">
            <NuxtLink :to="secondaryLink">
              {{ secondaryText }}
            </NuxtLink>
          </Button>
        </Flex>
      </Flex>
    </Container>
  </Section>
</template>
