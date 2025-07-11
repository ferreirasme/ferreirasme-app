'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function DesignExamplePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen gradient-luxury flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative z-10 text-center space-y-8 px-4">
          <h1 className="text-7xl md:text-8xl font-display text-gradient-gold animate-fade-in">
            Ferreiras ME
          </h1>
          <p className="text-2xl md:text-3xl font-serif text-muted-foreground animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            Joias que Contam Histórias
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-zoom-in" style={{ animationDelay: '0.6s' }}>
            <Button variant="luxury" size="xl" rounded="2xl" className="min-w-[200px]">
              Explorar Coleção
            </Button>
            <Button variant="outline" size="xl" rounded="2xl" className="min-w-[200px]">
              Agendar Visita
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-serif text-gradient-luxury">
                Tradição e Excelência
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Há mais de três décadas, a Ferreiras ME tem sido sinônimo de elegância e 
                qualidade no mundo das joias. Cada peça é cuidadosamente elaborada por 
                nossos mestres joalheiros, combinando técnicas tradicionais com design 
                contemporâneo.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Nossa missão é criar joias que não apenas adornam, mas que contam histórias 
                e celebram momentos especiais na vida de nossos clientes.
              </p>
              <Button variant="secondary" size="lg" className="mt-8">
                Nossa História
              </Button>
            </div>
            <div className="relative">
              <Card variant="luxury" className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-champagne to-pearl flex items-center justify-center">
                  <p className="text-6xl font-display text-bronze/50">Imagem</p>
                </div>
              </Card>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-24 bg-pearl/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif mb-4">Coleções Exclusivas</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra nossas coleções cuidadosamente curadas, onde cada peça 
              representa o ápice do design e da craftsmanship.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Collection Card 1 */}
            <Card variant="elegant" className="group overflow-hidden">
              <div className="aspect-[4/5] bg-gradient-to-br from-background to-muted overflow-hidden">
                <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                  <p className="text-4xl font-display text-muted-foreground/30">Diamantes</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Coleção Eternidade</CardTitle>
                <CardDescription>Diamantes selecionados para momentos únicos</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" className="w-full group-hover:text-primary transition-colors">
                  Explorar Coleção →
                </Button>
              </CardFooter>
            </Card>

            {/* Collection Card 2 */}
            <Card variant="luxury" className="group overflow-hidden">
              <div className="aspect-[4/5] bg-gradient-to-br from-pearl to-champagne overflow-hidden">
                <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                  <p className="text-4xl font-display text-bronze/30">Ouro Rosa</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Coleção Romance</CardTitle>
                <CardDescription>Peças delicadas em ouro rosa 18k</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="luxury" className="w-full">
                  Ver Coleção
                </Button>
              </CardFooter>
            </Card>

            {/* Collection Card 3 */}
            <Card variant="elegant" className="group overflow-hidden">
              <div className="aspect-[4/5] bg-gradient-to-br from-background to-muted overflow-hidden">
                <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                  <p className="text-4xl font-display text-muted-foreground/30">Pérolas</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Coleção Clássica</CardTitle>
                <CardDescription>Pérolas cultivadas de água salgada</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" className="w-full group-hover:text-primary transition-colors">
                  Descobrir Mais →
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-gold animate-pulse-gold">
                <span className="text-3xl text-white">✦</span>
              </div>
              <h3 className="text-2xl font-serif">Certificação Internacional</h3>
              <p className="text-muted-foreground">
                Todas as nossas peças acompanham certificado de autenticidade reconhecido mundialmente.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center shadow-luxury animate-pulse-gold" style={{ animationDelay: '0.5s' }}>
                <span className="text-3xl text-white">◈</span>
              </div>
              <h3 className="text-2xl font-serif">Design Personalizado</h3>
              <p className="text-muted-foreground">
                Criamos peças exclusivas que refletem sua personalidade e estilo único.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center shadow-xl animate-pulse-gold" style={{ animationDelay: '1s' }}>
                <span className="text-3xl text-white">❋</span>
              </div>
              <h3 className="text-2xl font-serif">Garantia Vitalícia</h3>
              <p className="text-muted-foreground">
                Oferecemos garantia vitalícia em todas as nossas criações exclusivas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 gradient-gold">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Card variant="glass" className="backdrop-blur-lg border-white/30">
            <CardHeader>
              <CardTitle className="text-3xl font-serif text-onyx">
                Fique por Dentro das Novidades
              </CardTitle>
              <CardDescription className="text-onyx/70">
                Receba em primeira mão informações sobre novas coleções e eventos exclusivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col sm:flex-row gap-4">
                <Input 
                  variant="luxury" 
                  inputSize="lg"
                  placeholder="seu@email.com"
                  className="flex-1 bg-white/90"
                />
                <Button variant="accent" size="lg" className="sm:w-auto">
                  Inscrever-se
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-5xl font-serif">Visite Nossa Boutique</h2>
              <p className="text-lg text-muted-foreground">
                Experimente o luxo e a elegância em nossa boutique exclusiva. 
                Nossa equipe especializada está pronta para ajudá-lo a encontrar 
                a peça perfeita.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary">📍</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Endereço</h4>
                    <p className="text-muted-foreground">
                      Rua das Joias, 123<br />
                      Jardim Elegante - São Paulo, SP
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary">📞</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Telefone</h4>
                    <p className="text-muted-foreground">(11) 1234-5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-accent">🕐</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Horário</h4>
                    <p className="text-muted-foreground">
                      Segunda a Sexta: 10h - 19h<br />
                      Sábado: 10h - 16h
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="primary" size="lg" className="mt-8">
                Agendar Visita Exclusiva
              </Button>
            </div>

            <Card variant="minimal" className="h-[400px]">
              <div className="w-full h-full bg-gradient-to-br from-muted to-background flex items-center justify-center">
                <p className="text-4xl font-display text-muted-foreground/30">Mapa</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-onyx text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-display text-gradient-gold">Ferreiras ME</h3>
            <p className="text-white/60">© 2024 Todos os direitos reservados</p>
            <div className="flex justify-center gap-6 mt-6">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <span className="text-2xl">𝕏</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <span className="text-2xl">📷</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <span className="text-2xl">▶</span>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}