'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Flex, Grid, Container, Section, Heading, Text } from "@/components/ui";
import { useTranslations } from "next-intl";

interface Faq {
  question: string;
  answer: string;
}

interface Props {
  faqs: Faq[];
}

function FaqItem({ faq, isOpen, onClick }: { faq: Faq, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border-b border-white/10 last:border-0 group cursor-pointer" onClick={onClick}>
      <Flex items="center" justify="between" className="py-6">
        <h3 className={`text-lg md:text-xl font-medium transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-white group-hover:text-white/80'}`}>
          {faq.question}
        </h3>
        <Flex items="center" justify="center" className="flex-shrink-0 ml-4 relative w-8 h-8 rounded-lg border border-white/10 group-hover:border-white/20 transition-colors bg-white/5">
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Plus className={`w-4 h-4 transition-colors ${isOpen ? 'text-primary' : 'text-white'}`} />
          </motion.div>
        </Flex>
      </Flex>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 sm:pb-8 pr-4 sm:pr-12">
              <Text className="text-base md:text-[17px]">
                {faq.answer}
              </Text>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection({ faqs }: Props) {
  const t = useTranslations('Home');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section className="py-16 sm:py-24 md:py-32 relative bg-background z-10 overflow-hidden">
      {/* Subtle dot pattern background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', 
          backgroundSize: '24px 24px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }} 
      />
      <Container size="6xl" className="relative z-10">
        <Grid cols={1} className="lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-24">
          
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <Heading level={2} className="text-3xl sm:text-4xl md:text-5xl leading-[1.1] mb-4 sm:mb-6 font-heading">
                  {t('faq_title')}
                </Heading>
                <Text className="text-base md:text-lg">
                  {t('faq_desc')}
                </Text>
              </motion.div>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col border-t border-white/10"
            >
              {faqs.map((faq, index) => (
                <FaqItem 
                  key={index} 
                  faq={faq} 
                  isOpen={openIndex === index} 
                  onClick={() => setOpenIndex(openIndex === index ? null : index)} 
                />
              ))}
            </motion.div>
          </div>

        </Grid>
      </Container>
    </Section>
  );
}
