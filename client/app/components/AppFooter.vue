<script setup lang="ts">
import Box from '@/components/ui/layout/Box.vue'
import Flex from '@/components/ui/layout/Flex.vue'
import Grid from '@/components/ui/layout/Grid.vue'
import Container from '@/components/ui/layout/Container.vue'
import Text from '@/components/ui/typography/Text.vue'
import Heading from '@/components/ui/typography/Heading.vue'

const currentYear = new Date().getFullYear()
</script>

<template>
  <Box as="footer" class="border-t border-white/5 bg-black relative overflow-hidden">
    <!-- Watermark text -->
    <Flex justify="center" class="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none opacity-[0.02] translate-y-1/4">
      <Text as="span" class="text-[15vw] font-black uppercase whitespace-nowrap leading-none tracking-tighter">hostihub</Text>
    </Flex>

    <Container size="lg" class="pt-16 pb-8 relative z-10">
      <Grid cols="1" class="md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
        <!-- Brand -->
        <Flex direction="col" gap="6">
          <NuxtLink to="/" class="flex items-center gap-2">
            <Text as="span" size="xl" weight="bold" class="text-white tracking-tight">Hosti<span class="text-primary">Hub</span></Text>
          </NuxtLink>
          <Text size="sm" variant="muted" class="leading-relaxed max-w-xs">
            Yüksek performanslı, güvenilir ve yenilikçi hosting çözümleri. Dijital dünyadaki eviniz.
          </Text>
          <Flex align="center" gap="4">
            <!-- Discord -->
            <a href="#" class="w-10 h-10 rounded-full bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center text-zinc-400 transition-all duration-300 border border-white/10 hover:border-transparent">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
            </a>
            <!-- Instagram -->
            <a href="#" class="w-10 h-10 rounded-full bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center text-zinc-400 transition-all duration-300 border border-white/10 hover:border-transparent">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"/>
              </svg>
            </a>
            <!-- TikTok -->
            <a href="#" class="w-10 h-10 rounded-full bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center text-zinc-400 transition-all duration-300 border border-white/10 hover:border-transparent">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 013.183-4.51v-3.5a6.329 6.329 0 00-5.394 10.692 6.33 6.33 0 0010.857-4.424V8.687a8.182 8.182 0 004.773 1.526V6.79a4.831 4.831 0 01-1.003-.104z"/>
              </svg>
            </a>
          </Flex>
          <a href="mailto:iletisim@hostihub.com" class="inline-block text-sm text-zinc-400 hover:text-primary transition-colors">
            iletisim@hostihub.com
          </a>
        </Flex>

        <!-- Hizmetler -->
        <Box>
          <Heading as="h3" size="h6" class="text-white font-semibold mb-6">Hizmetler</Heading>
          <Flex as="ul" direction="col" gap="4">
            <li><NuxtLink to="/hosting/web" class="text-zinc-400 hover:text-primary text-sm transition-colors">Web Hosting</NuxtLink></li>
            <li><NuxtLink to="/hosting/mail" class="text-zinc-400 hover:text-primary text-sm transition-colors">Mail Hosting</NuxtLink></li>
            <li><NuxtLink to="/servers/vps" class="text-zinc-400 hover:text-primary text-sm transition-colors">VDS Sunucu</NuxtLink></li>
            <li><NuxtLink to="/servers/dedicated" class="text-zinc-400 hover:text-primary text-sm transition-colors">Dedicated Sunucu</NuxtLink></li>
          </Flex>
        </Box>

        <!-- Bağlantılar -->
        <Box>
          <Heading as="h3" size="h6" class="text-white font-semibold mb-6">Bağlantılar</Heading>
          <Flex as="ul" direction="col" gap="4">
            <li><NuxtLink to="/about" class="text-zinc-400 hover:text-primary text-sm transition-colors">Hakkımızda</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-zinc-400 hover:text-primary text-sm transition-colors">İletişim</NuxtLink></li>
            <li><NuxtLink to="/blog" class="text-zinc-400 hover:text-primary text-sm transition-colors">Blog</NuxtLink></li>
            <li><NuxtLink to="/auth/login" class="text-zinc-400 hover:text-primary text-sm transition-colors">Müşteri Paneli</NuxtLink></li>
          </Flex>
        </Box>

        <!-- Yasal -->
        <Box>
          <Heading as="h3" size="h6" class="text-white font-semibold mb-6">Yasal</Heading>
          <Flex as="ul" direction="col" gap="4">
            <li><NuxtLink to="/legal/terms" class="text-zinc-400 hover:text-primary text-sm transition-colors">Kullanım Şartları</NuxtLink></li>
            <li><NuxtLink to="/legal/privacy" class="text-zinc-400 hover:text-primary text-sm transition-colors">Gizlilik Politikası</NuxtLink></li>
            <li><NuxtLink to="/legal/refund" class="text-zinc-400 hover:text-primary text-sm transition-colors">İade Koşulları</NuxtLink></li>
            <li><NuxtLink to="/legal/kvkk" class="text-zinc-400 hover:text-primary text-sm transition-colors">KVKK Aydınlatma Metni</NuxtLink></li>
          </Flex>
        </Box>
      </Grid>

      <!-- Bottom Bar -->
      <Flex direction="col" class="md:flex-row items-center justify-between pt-8 border-t border-white/5" gap="4">
        <Text size="sm" variant="muted" class="text-center md:text-left">
          &copy; {{ currentYear }} HostiHub. Tüm hakları saklıdır.
        </Text>
        <Flex align="center" gap="6" class="text-sm text-zinc-500">
          <Text as="span" size="sm" variant="muted">%99.9 Uptime Garantisi</Text>
          <Box as="span" class="w-1 h-1 rounded-full bg-zinc-700"></Box>
          <Text as="span" size="sm" variant="muted">7/24 Destek</Text>
        </Flex>
      </Flex>
    </Container>
  </Box>
</template>
