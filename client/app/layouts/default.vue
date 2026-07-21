<script setup lang="ts">
import Flex from '@/components/ui/layout/Flex.vue'
import Box from '@/components/ui/layout/Box.vue'
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'
import ThreeBackground from '@/components/ui/layout/ThreeBackground.vue'
</script>

<template>
  <Box class="relative min-h-screen bg-black text-white isolate">
    <ThreeBackground />
    <Flex direction="col" class="min-h-screen">
      <NavBar />
      <Box as="main" class="flex-1 w-full relative z-10">
        <slot />
      </Box>
      <AppFooter class="relative z-10" />
    </Flex>
  </Box>
</template>
