'use client'

import { motion } from "framer-motion";
import { Cpu, Headset, TrendingUp } from "lucide-react";

const features = [
  {
    title: 'Geleceğe Hazır Platform',
    description: 'Web\'in geleceğine uyum sağlamak için sürekli gelişiyoruz. En güncel donanımlar ve optimize edilmiş ağ altyapısı.',
    icon: Cpu,
    gradient: 'from-blue-500/20 to-primary/20',
  },
  {
    title: 'Gerçek İnsan Desteği',
    description: 'Çünkü projeleriniz ve sorunlarınız, otomatik bot yanıtlarından çok daha fazlasını hak ediyor. Uzman teknik ekibimiz 7/24 yanınızda.',
    icon: Headset,
    gradient: 'from-primary/20 to-purple-500/20',
  },
  {
    title: 'Sınır Tanımayan Büyüme',
    description: 'Küçük projelerden devasa enterprise altyapılara kadar, HostiHub sizinle birlikte efor sarf etmeden kolayca ölçeklenir.',
    icon: TrendingUp,
    gradient: 'from-purple-500/20 to-pink-500/20',
  }
];

export function Features() {
  return (
    <section className="relative z-10 py-16 sm:py-24 md:py-32 bg-transparent">
      <div className="w-full text-center space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl px-6 space-y-4"
        >
          <div className="mx-auto w-fit rounded-full bg-gradient-to-r from-primary/50 via-purple-500/50 to-primary/50 p-px">
            <div className="rounded-full bg-background px-4 py-1.5 text-xs text-white font-medium tracking-wide">
              Maksimum Güç İçin Tasarlandı
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium font-sans text-white leading-[1.15] tracking-tight">
            Neden HostiHub?
          </h2>
          
          <p className="mx-auto max-w-2xl text-base md:text-[17px] text-foreground/70 font-normal leading-relaxed">
            Mühendisler tarafından, geliştiriciler ve oyuncular için inşa edildi. Kurumsal seviye DDoS koruması, premium donanımlar ve dünya çapında düşük gecikmeli ağ yönlendirmesi sağlıyoruz.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-16 bg-white/[0.01] border-y border-white/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className={`group min-h-[320px] sm:min-h-[380px] lg:min-h-[460px] flex flex-col justify-between border-b border-white/10 lg:border-b-0 ${
                    index !== features.length - 1 ? 'lg:border-r lg:border-white/10' : ''
                  }`}
                >
                  <div className="relative h-44 sm:h-52 md:h-64 w-full flex items-center justify-center overflow-hidden py-6 sm:py-8">
                    {/* Background glow */}
                    <div 
                      className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl`}
                    />
                    
                    {/* Concentric rings */}
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 flex items-center justify-center">
                      {/* Outer ring */}
                      <div className="absolute inset-0 rounded-full border border-white/[0.06] group-hover:border-primary/20 group-hover:scale-110 transition-all duration-700" />
                      {/* Middle ring */}
                      <div className="absolute inset-4 rounded-full border border-white/[0.08] group-hover:border-primary/30 group-hover:scale-105 transition-all duration-500" />
                      {/* Inner ring */}
                      <div className="absolute inset-8 rounded-full border border-white/10 group-hover:border-primary/40 transition-all duration-300" />
                      {/* Icon container */}
                      <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:border-primary/40 group-hover:bg-primary/10 flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(100,107,242,0.2)]">
                        <Icon className="w-7 h-7 text-white/70 group-hover:text-primary transition-colors duration-500" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-5 sm:px-8 md:px-10 pb-8 sm:pb-10 md:pb-12 pt-4 sm:pt-6 text-left space-y-2 sm:space-y-3">
                    <h3 className="text-2xl font-semibold tracking-tight text-white group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-[15px] text-foreground/70 font-normal leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
