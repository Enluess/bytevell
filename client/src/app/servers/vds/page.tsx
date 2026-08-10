'use client';

import { motion } from "framer-motion";
import { Cpu } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Flex, Container, Section, Card, Badge, Heading, Text } from "@/components/ui";

const FaqSection = dynamic(() => import('@/components/FaqSection').then(mod => mod.FaqSection));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default function VDSServersPage() {

  const faqs = [
    {
      question: 'Sanal sunucularda yedekleme hizmeti veriyor musunuz?',
      answer: 'Sanal sunucularımızda otomatik günlük yedekleme ücretsiz olarak sağlanmaktadır, ancak verilerinizin güvenliği için sizin de farklı bir yerde yedek bulundurmanızı tavsiye ederiz.'
    },
    {
      question: 'Sanal sunucumun RAM/CPU özelliklerini sonradan yükseltebilir miyim?',
      answer: 'Evet, dilediğiniz zaman sunucunuzun kaynaklarını (RAM, CPU vb.) panel üzerinden bir üst pakete geçiş yaparak anında yükseltebilirsiniz.'
    },
    {
      question: 'Teslimat ne kadar sürüyor?',
      answer: 'Sanal sunucu siparişleriniz ödeme onayından hemen sonra otomatik olarak kurularak saniyeler içerisinde teslim edilir.'
    },
    {
      question: 'Oyun sunucusu barındırmak için uygun mu?',
      answer: 'Kesinlikle. Ryzen 9 9950X serisi işlemcilerimiz, yüksek çekirdek performansı sayesinde Minecraft ve FiveM gibi oyun sunucuları için rakipsiz bir performans sağlar.'
    },
    {
      question: 'SSH veya uzak masaüstü bağlantısı sağlıyor musunuz?',
      answer: 'Evet, Linux işletim sistemleri için SSH, Windows işletim sistemleri için RDP (Uzak Masaüstü) erişimi tam root/yönetici yetkileri ile tarafınıza iletilmektedir.'
    }
  ];

  const plans = [
    { ram: '2GB', disk: '30 GB NVMe Disk', cpu: '1 Core CPU @ 5.7 GHz', net: '20 Gbps Internet', price: '243,54' },
    { ram: '4GB', disk: '40 GB NVMe Disk', cpu: '2 Core CPU @ 5.7 GHz', net: '20 Gbps Internet', price: '487,08' },
    { ram: '6GB', disk: '50 GB NVMe Disk', cpu: '4 Core CPU @ 5.7 GHz', net: '20 Gbps Internet', price: '730,62' },
    { ram: '8GB', disk: '60 GB NVMe Disk', cpu: '4 Core CPU @ 5.7 GHz', net: '20 Gbps Internet', price: '974,16' },
    { ram: '10GB', disk: '70 GB NVMe Disk', cpu: '4 Core CPU @ 5.7 GHz', net: '20 Gbps Internet', price: '1.217,70' },
    { ram: '12GB', disk: '80 GB NVMe Disk', cpu: '4 Core CPU @ 5.7 GHz', net: '20 Gbps Internet', price: '1.461,24' }
  ];

  return (
    <Flex col className="flex-1 min-h-screen">
      
      {/* Hero Section */}
      <Flex col items="center" justify="center" className="relative px-6 pb-20 pt-32 text-center overflow-hidden">
        <BackgroundEffects />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Heading level={1} className="mx-auto mt-10 max-w-4xl select-none leading-[1.05] tracking-tight">
            Ryzen 9 9950X <br /> Sanal Sunucular
          </Heading>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Text className="mx-auto mt-8 max-w-2xl md:text-[17px] tracking-wide">
            AMD Ryzen 9 9950X işlemcili NVMe VDS sunucu paketleriyle projelerinizi uçuşa geçirin. DDR5 RAM, root erişimi ve üst düzey koruma dahildir.
          </Text>
        </motion.div>
      </Flex>

      {/* Pricing Section */}
      <Section id="pricing" className="pt-0">
        <Container>
          <Flex col gap="3">
            {plans.map((plan, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.05 }}>
                <Card className="p-4 md:p-5 group">
                  <Flex col className="md:flex-row md:items-center justify-between gap-5">
                    
                    {/* Left Side: Specs */}
                    <Flex className="flex-wrap md:flex-nowrap items-center w-full md:w-auto" gap="4 md:gap-6">
                      
                      {/* RAM & Logo */}
                      <Flex items="center" gap="4" className="w-40 shrink-0">
                        <Flex items="center" justify="center" className="p-2.5 rounded-xl bg-white/5 text-white/50 group-hover:text-white group-hover:bg-white/10 transition-colors">
                          <Cpu className="w-6 h-6" strokeWidth={1.5} />
                        </Flex>
                        <Flex col>
                          <span className="text-[10px] font-bold text-white/40 tracking-wider uppercase">AMD Ryzen</span>
                          <span className="font-bold text-white text-[17px] tracking-wide">{plan.ram} RAM</span>
                        </Flex>
                      </Flex>

                      {/* Specs Pills */}
                      <Flex items="center" gap="2" className="flex-wrap">
                        <Badge>{plan.disk}</Badge>
                        <Badge>{plan.cpu}</Badge>
                        <Badge>{plan.net}</Badge>
                      </Flex>
                    </Flex>

                    {/* Right Side: Price & Buy */}
                    <Flex className="w-full md:w-auto pt-4 md:pt-0 border-t border-white/5 md:border-0 mt-2 md:mt-0" items="center" justify="between" gap="6 md:gap-8">
                      <Flex items="baseline" gap="1">
                        <span className="text-xl font-black text-white tracking-tight">₺{plan.price}</span>
                        <span className="text-xs font-medium text-white/40 tracking-wider">/aylık</span>
                      </Flex>
                      <Link href={`/checkout?plan=vds-${plan.ram.toLowerCase()}`} className="px-8 py-2.5 rounded-xl bg-white text-black font-bold hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] shrink-0">
                        Satın Al
                      </Link>
                    </Flex>

                  </Flex>
                </Card>
              </motion.div>
            ))}
          </Flex>
        </Container>
      </Section>

      <Container className="max-w-6xl pb-20">
        <FaqSection faqs={faqs} />
      </Container>

      <Footer />
    </Flex>
  );
}
