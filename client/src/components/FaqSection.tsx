'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

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
      <div className="py-6 flex items-center justify-between">
        <h3 className={`text-lg md:text-xl font-medium transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-white group-hover:text-white/80'}`}>
          {faq.question}
        </h3>
        <div className="flex-shrink-0 ml-4 relative flex items-center justify-center w-8 h-8 rounded-full border border-white/10 group-hover:border-white/20 transition-colors bg-white/5">
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Plus className={`w-4 h-4 transition-colors ${isOpen ? 'text-primary' : 'text-white'}`} />
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-8 pr-12">
              <p className="text-foreground/70 text-base md:text-[17px] leading-relaxed font-normal">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 relative bg-transparent z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="w-fit rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-medium tracking-wide mb-6">
                  Sıkça Sorulan Sorular
                </div>
                <h2 className="text-4xl md:text-5xl font-medium font-sans text-white leading-[1.1] tracking-tight mb-6">
                  Aklınızda soru işareti kalmasın.
                </h2>
                <p className="text-foreground/70 text-base md:text-lg leading-relaxed">
                  Platformumuz hakkında en çok merak edilen soruları ve cevapları sizin için derledik.
                </p>
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

        </div>
      </div>
    </section>
  );
}
