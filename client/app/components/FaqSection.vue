<script setup lang="ts">
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import Section from '@/components/ui/layout/Section.vue'
import Container from '@/components/ui/layout/Container.vue'
import Grid from '@/components/ui/layout/Grid.vue'
import Box from '@/components/ui/layout/Box.vue'
import Heading from '@/components/ui/typography/Heading.vue'
import Text from '@/components/ui/typography/Text.vue'

interface Faq {
  question: string
  answer: string
}

interface Props {
  faqs: Faq[]
}

defineProps<Props>()
</script>

<template>
  <Section class="border-t border-white/5 bg-black" padding="xl">
    <Container size="lg">
      <Grid cols="1" class="lg:grid-cols-5 gap-12">
        <Box class="lg:col-span-2">
          <Heading as="h2" size="h2" class="text-white whitespace-pre-line leading-tight">
            Sıkça<br>sorulan<br>sorular.
          </Heading>
        </Box>
        <Box class="lg:col-span-3">
          <Accordion type="single" class="w-full space-y-4" collapsible>
            <AccordionItem 
              v-for="(faq, index) in faqs" 
              :key="index" 
              :value="`item-${index}`"
              class="border border-white/10 rounded-xl bg-white/[0.02] px-6 transition-colors hover:bg-white/[0.04]"
            >
              <AccordionTrigger class="text-lg font-medium text-white hover:no-underline hover:text-white/80 py-6">
                {{ faq.question }}
              </AccordionTrigger>
              <AccordionContent class="text-zinc-400 leading-relaxed pb-6 text-base">
                {{ faq.answer }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Box>
      </Grid>
    </Container>
  </Section>
</template>
