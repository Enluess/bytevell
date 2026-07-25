<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Send } from 'lucide-vue-next'
import { Box, Grid } from '@/components/ui/layout'
import { Text } from '@/components/ui/typography'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

const submitForm = async () => {
  isSubmitting.value = true
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  isSubmitting.value = false
  // Reset
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
  alert('Mesajınız başarıyla gönderildi!')
}
</script>

<template>
  <Box as="form" @submit.prevent="submitForm" class="space-y-6">
    <Grid class="grid-cols-1 md:grid-cols-2 gap-6">
      <Box class="space-y-2">
        <Label for="name" class="text-sm text-zinc-300 font-medium">Ad Soyad</Label>
        <Input 
          id="name" 
          v-model="form.name" 
          type="text" 
          required
          placeholder="Adınız ve Soyadınız" 
          class="w-full px-4 py-3 bg-zinc-900/80 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
        />
      </Box>
      <Box class="space-y-2">
        <Label for="email" class="text-sm text-zinc-300 font-medium">E-posta</Label>
        <Input 
          id="email" 
          v-model="form.email" 
          type="email" 
          required
          placeholder="E-posta adresiniz" 
          class="w-full px-4 py-3 bg-zinc-900/80 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
        />
      </Box>
    </Grid>
    
    <Box class="space-y-2">
      <Label for="subject" class="text-sm text-zinc-300 font-medium">Konu</Label>
      <Input 
        id="subject" 
        v-model="form.subject" 
        type="text" 
        required
        placeholder="Mesajınızın konusu" 
        class="w-full px-4 py-3 bg-zinc-900/80 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
      />
    </Box>
    
    <Box class="space-y-2">
      <Label for="message" class="text-sm text-zinc-300 font-medium">Mesaj</Label>
      <Textarea 
        id="message" 
        v-model="form.message" 
        required
        rows="5"
        placeholder="Mesajınız..." 
        class="w-full px-4 py-3 bg-zinc-900/80 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-y"
      />
    </Box>
    
    <Button 
      type="submit" 
      :disabled="isSubmitting"
      class="w-full px-6 py-4 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-white/10"
    >
      <Send v-if="!isSubmitting" class="w-5 h-5" />
      <Box as="span" v-if="isSubmitting" class="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
      <Text as="span">{{ isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder' }}</Text>
    </Button>
  </Box>
</template>
