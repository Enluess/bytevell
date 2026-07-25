<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Box from '@/components/ui/layout/Box.vue'
import Container from '@/components/ui/layout/Container.vue'
import Flex from '@/components/ui/layout/Flex.vue'
import Grid from '@/components/ui/layout/Grid.vue'
import Text from '@/components/ui/typography/Text.vue'

interface Reference {
  name: string
  count: string
}

interface Props {
  references: Reference[]
}

defineProps<Props>()

// Animated counter
const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.3 }
  )

  const el = document.querySelector('.stats-bar')
  if (el) observer.observe(el)
})
</script>

<template>
  <Box class="stats-bar py-16 bg-black/50 backdrop-blur-sm relative">
    <!-- Top subtle line -->
    <Box class="absolute top-0 left-0 right-0 h-px bg-white/5" />
    
    <Container size="lg">
      <Grid class="grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        <Flex 
          v-for="(ref, index) in references" 
          :key="index"
          direction="col"
          align="center"
          justify="center"
          gap="3"
          class="text-center group"
          :class="{ 'animate-count-up': isVisible }"
          :style="{ animationDelay: `${index * 150}ms` }"
        >
          <!-- Value - white, clean -->
          <Text class="text-4xl md:text-5xl font-bold text-white tracking-tighter">
            {{ ref.count }}
          </Text>
          
          <!-- Label -->
          <Text class="text-sm font-medium text-zinc-500 uppercase tracking-widest group-hover:text-zinc-400 transition-colors duration-300">
            {{ ref.name }}
          </Text>
        </Flex>
      </Grid>
    </Container>

    <!-- Bottom subtle line -->
    <Box class="absolute bottom-0 left-0 right-0 h-px bg-white/5" />
  </Box>
</template>
