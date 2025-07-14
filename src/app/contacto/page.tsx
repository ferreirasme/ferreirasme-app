'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import ContactForm from '@/components/ContactForm'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import GoldParticles from '@/components/GoldParticles'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function ContactoPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-24 pb-12">
        <GoldParticles />
        <WhatsAppButton />
        
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-light text-center text-foreground mb-4">
              Contacto
            </h1>
            <p className="text-xl text-center text-foreground/70 mb-16">
              Estamos aqui para tornar os seus sonhos em joias exclusivas
            </p>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Formulário */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-foreground/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-foreground/20"
              >
                <h2 className="text-2xl font-light tracking-wider text-center mb-6 text-yellow-400">
                  ENVIE-NOS UMA MENSAGEM
                </h2>
                <ContactForm />
              </motion.div>

              {/* Informações de Contacto */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-8"
              >
                <div className="bg-foreground/5 backdrop-blur-xl rounded-3xl p-6 border border-foreground/20">
                  <h3 className="text-xl font-light text-yellow-400 mb-6">INFORMAÇÕES</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Mail className="w-5 h-5 text-yellow-400 mt-1" />
                      <div>
                        <p className="font-light text-foreground/80">Correio Eletrónico</p>
                        <a href="mailto:contato@ferreirasme.com" className="text-foreground hover:text-yellow-400 transition-colors">
                          contato@ferreirasme.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="w-5 h-5 text-yellow-400 mt-1" />
                      <div>
                        <p className="font-light text-foreground/80">WhatsApp</p>
                        <a href="https://wa.me/351912465539" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-yellow-400 transition-colors">
                          +351 912 465 539
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 text-yellow-400 mt-1" />
                      <div>
                        <p className="font-light text-foreground/80">Localização</p>
                        <p className="text-foreground">Portugal</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Clock className="w-5 h-5 text-yellow-400 mt-1" />
                      <div>
                        <p className="font-light text-foreground/80">Horário de Atendimento</p>
                        <p className="text-foreground">Segunda a Sexta: 9h - 18h</p>
                        <p className="text-foreground">Sábado: 10h - 14h</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 backdrop-blur-xl rounded-3xl p-6 border border-yellow-400/30">
                  <h3 className="text-xl font-light text-yellow-400 mb-4">COMPROMISSO FERREIRAS.ME</h3>
                  <p className="text-foreground/80 leading-relaxed">
                    Cada peça é criada com dedicação artesanal, transformando metais nobres 
                    em semijoias que contam histórias. Trabalhamos com excelência para criar 
                    peças únicas que reflitam a sua essência.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
}