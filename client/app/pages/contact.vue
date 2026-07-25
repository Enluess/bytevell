<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Mail, MessageCircle, Clock, MapPin } from 'lucide-vue-next'
import Box from '@/components/ui/layout/Box.vue'
import Flex from '@/components/ui/layout/Flex.vue'
import Grid from '@/components/ui/layout/Grid.vue'
import Section from '@/components/ui/layout/Section.vue'
import Container from '@/components/ui/layout/Container.vue'
import Heading from '@/components/ui/typography/Heading.vue'
import Text from '@/components/ui/typography/Text.vue'
import PageHero from '@/components/PageHero.vue'
import ContactForm from '@/components/ContactForm.vue'
import ContactInfoCard from '@/components/ContactInfoCard.vue'

useHead({ title: 'İletişim - HostiHub' })

const observerRef = ref<IntersectionObserver | null>(null)

onMounted(() => {
  observerRef.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
    observerRef.value?.observe(el)
  })
})

onUnmounted(() => {
  observerRef.value?.disconnect()
})
</script>

<template>
  <Box>
    <!-- Keep the consistent Hero -->
    <PageHero 
      title="Bize Ulaşın" 
      description="Sorularınız, teknik destek talepleriniz veya kurumsal çözümler için 7/24 yanınızdayız." 
    />

    <!-- Split Layout Content -->
    <Section padding="xl" class="relative z-10 bg-black">
      <Container size="lg">
        <Grid cols="1" class="lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          <!-- Left Side: Information -->
          <Flex direction="col" gap="10" class="reveal-on-scroll">
            <Box>
              <Heading as="h2" size="h2" class="text-white mb-6">Nasıl Yardımcı Olabiliriz?</Heading>
              <Text size="lg" class="text-zinc-400 leading-relaxed">
                Mevcut hizmetlerinizle ilgili destek almak, yeni projeniz için altyapı planlamak veya satış ekibimizle görüşmek için formu doldurabilirsiniz. 
                Sistem mühendislerimiz talebinizi inceleyip en kısa sürede (ortalama 15 dakika içinde) size dönüş yapacaktır.
              </Text>
            </Box>
            
            <Grid cols="1" class="sm:grid-cols-2 gap-6 mt-4">
              <ContactInfoCard 
                title="E-posta" 
                value="destek@hostihub.com" 
                :icon="Mail" 
              />
              <ContactInfoCard 
                title="Topluluk" 
                value="Discord Sunucusu" 
                :icon="MessageCircle" 
              />
              <ContactInfoCard 
                title="Çalışma Saatleri" 
                value="7/24 Kesintisiz" 
                :icon="Clock" 
              />
              <ContactInfoCard 
                title="Konum" 
                value="İstanbul, TR" 
                :icon="MapPin" 
              />
            </Grid>
          </Flex>

          <!-- Right Side: Form -->
          <Box class="reveal-on-scroll" style="transition-delay: 200ms;">
            <Box class="glass-card p-8 sm:p-10 relative overflow-hidden h-full">
              <!-- Soft inner glow -->
              <Box class="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
              
              <Box class="relative z-10">
                <Heading as="h3" size="h3" class="text-white mb-2">Mesaj Gönderin</Heading>
                <Text size="base" class="text-zinc-400 mb-8">Formu doldurun, sizinle hemen iletişime geçelim.</Text>
                <ContactForm />
              </Box>
            </Box>
          </Box>
          
        </Grid>
      </Container>
    </Section>
    
    <!-- Gradient Separator -->
    <Box class="gradient-separator" />
  </Box>
</template>
