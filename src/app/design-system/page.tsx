'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function DesignSystemPage() {
  const [isDark, setIsDark] = useState(false)

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-6xl font-display text-gradient-gold">
            Ferreiras ME Design System
          </h1>
          <Button variant="outline" onClick={toggleDarkMode}>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl">
          A comprehensive design system for luxury jewelry, emphasizing elegance, sophistication, and premium aesthetics.
        </p>
      </div>

      {/* Color Palette */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl font-serif mb-8">Color Palette</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="space-y-2">
            <div className="h-24 bg-primary rounded-lg shadow-sm animate-float"></div>
            <h3 className="font-medium">Primary Gold</h3>
            <p className="text-sm text-muted-foreground">#FFD700</p>
          </div>
          
          <div className="space-y-2">
            <div className="h-24 bg-secondary rounded-lg shadow-sm"></div>
            <h3 className="font-medium">Rose Gold</h3>
            <p className="text-sm text-muted-foreground">#B76E79</p>
          </div>
          
          <div className="space-y-2">
            <div className="h-24 bg-accent rounded-lg shadow-sm"></div>
            <h3 className="font-medium">Deep Burgundy</h3>
            <p className="text-sm text-muted-foreground">#6B2C39</p>
          </div>
          
          <div className="space-y-2">
            <div className="h-24 bg-champagne rounded-lg shadow-sm"></div>
            <h3 className="font-medium">Champagne</h3>
            <p className="text-sm text-muted-foreground">#E2D1B3</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-24 bg-pearl rounded-lg shadow-sm border border-border"></div>
            <h3 className="font-medium">Pearl</h3>
            <p className="text-sm text-muted-foreground">#F5F2EA</p>
          </div>
          
          <div className="space-y-2">
            <div className="h-24 bg-onyx rounded-lg shadow-sm"></div>
            <h3 className="font-medium">Onyx</h3>
            <p className="text-sm text-muted-foreground">#141414</p>
          </div>
          
          <div className="space-y-2">
            <div className="h-24 bg-bronze rounded-lg shadow-sm"></div>
            <h3 className="font-medium">Bronze</h3>
            <p className="text-sm text-muted-foreground">#A67C52</p>
          </div>
          
          <div className="space-y-2">
            <div className="h-24 gradient-gold rounded-lg shadow-sm"></div>
            <h3 className="font-medium">Gold Gradient</h3>
            <p className="text-sm text-muted-foreground">Luxury blend</p>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl font-serif mb-8">Typography</h2>
        
        <div className="space-y-6 mb-8">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Display · Bodoni Moda</p>
            <h1 className="text-7xl font-display">Luxury Redefined</h1>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Heading 1 · Playfair Display</p>
            <h1 className="text-5xl font-serif">Exquisite Craftsmanship</h1>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Heading 2 · Playfair Display</p>
            <h2 className="text-3xl font-serif">Timeless Elegance</h2>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Body · Inter</p>
            <p className="text-base leading-relaxed max-w-3xl">
              Each piece in our collection represents the pinnacle of jewelry artistry, 
              combining traditional craftsmanship with contemporary design. Our master 
              jewelers meticulously select only the finest materials.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <div className="text-center">
            <p className="text-xs mb-2">XS</p>
            <p className="text-xs">12px</p>
          </div>
          <div className="text-center">
            <p className="text-sm mb-2">SM</p>
            <p className="text-xs">14px</p>
          </div>
          <div className="text-center">
            <p className="text-base mb-2">Base</p>
            <p className="text-xs">16px</p>
          </div>
          <div className="text-center">
            <p className="text-lg mb-2">LG</p>
            <p className="text-xs">18px</p>
          </div>
          <div className="text-center">
            <p className="text-xl mb-2">XL</p>
            <p className="text-xs">20px</p>
          </div>
          <div className="text-center">
            <p className="text-2xl mb-2">2XL</p>
            <p className="text-xs">24px</p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl font-serif mb-8">Buttons</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="luxury">Luxury</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-4">Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
              <Button size="icon" variant="outline">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-4">Border Radius</h3>
            <div className="flex flex-wrap gap-4">
              <Button rounded="sm">Small Radius</Button>
              <Button rounded="md">Medium Radius</Button>
              <Button rounded="lg">Large Radius</Button>
              <Button rounded="xl">XL Radius</Button>
              <Button rounded="2xl">2XL Radius</Button>
              <Button rounded="full">Full Radius</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl font-serif mb-8">Cards</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card variant="elegant">
            <CardHeader>
              <CardTitle>Elegant Card</CardTitle>
              <CardDescription>Classic design with subtle shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Perfect for product displays and information cards.</p>
            </CardContent>
            <CardFooter>
              <Button variant="primary" className="w-full">Learn More</Button>
            </CardFooter>
          </Card>

          <Card variant="luxury">
            <CardHeader>
              <CardTitle>Luxury Card</CardTitle>
              <CardDescription>Premium gradient background</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Ideal for featuring exclusive collections.</p>
            </CardContent>
            <CardFooter>
              <Button variant="luxury" className="w-full">Exclusive Access</Button>
            </CardFooter>
          </Card>

          <Card variant="minimal">
            <CardHeader>
              <CardTitle>Minimal Card</CardTitle>
              <CardDescription>Clean and simple design</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Great for secondary information or lists.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Forms */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl font-serif mb-8">Form Elements</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-4">Input Variants</h3>
            <Input variant="elegant" placeholder="Elegant input" />
            <Input variant="luxury" placeholder="Luxury input" />
            <Input variant="minimal" placeholder="Minimal input" />
            <Input variant="glass" placeholder="Glass input" />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-4">Input Sizes</h3>
            <Input inputSize="sm" placeholder="Small input" />
            <Input inputSize="md" placeholder="Medium input" />
            <Input inputSize="lg" placeholder="Large input" />
            <Input inputSize="xl" placeholder="Extra large input" />
          </div>
        </div>
      </section>

      {/* Shadows */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl font-serif mb-8">Shadows</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg shadow-xs">
            <p className="font-medium">XS Shadow</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <p className="font-medium">SM Shadow</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <p className="font-medium">MD Shadow</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <p className="font-medium">LG Shadow</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-xl">
            <p className="font-medium">XL Shadow</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-2xl">
            <p className="font-medium">2XL Shadow</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-gold">
            <p className="font-medium">Gold Shadow</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-luxury">
            <p className="font-medium">Luxury Shadow</p>
          </div>
        </div>
      </section>

      {/* Animations */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl font-serif mb-8">Animations</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card variant="elegant" className="animate-float">
            <CardContent className="p-6">
              <p className="font-medium">Float</p>
            </CardContent>
          </Card>
          
          <Card variant="elegant" className="animate-pulse-gold">
            <CardContent className="p-6">
              <p className="font-medium">Pulse Gold</p>
            </CardContent>
          </Card>
          
          <Card variant="elegant" className="animate-glow">
            <CardContent className="p-6">
              <p className="font-medium">Glow</p>
            </CardContent>
          </Card>
          
          <div className="bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer bg-[length:200%_100%] p-6 rounded-lg">
            <p className="font-medium">Shimmer</p>
          </div>
        </div>
      </section>

      {/* Special Effects */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl font-serif mb-8">Special Effects</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="gradient-gold p-8 rounded-xl">
            <h3 className="text-2xl font-serif text-onyx mb-2">Gold Gradient</h3>
            <p className="text-onyx/80">Luxurious gradient background</p>
          </div>
          
          <div className="gradient-luxury p-8 rounded-xl">
            <h3 className="text-2xl font-serif mb-2">Luxury Gradient</h3>
            <p className="text-muted-foreground">Elegant pearl tones</p>
          </div>
          
          <div className="glass p-8 rounded-xl">
            <h3 className="text-2xl font-serif mb-2">Glass Effect</h3>
            <p className="text-foreground/80">Frosted glass appearance</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-5xl font-display text-gradient-gold mb-4">
            Text Gradients
          </h3>
          <p className="text-xl text-gradient-luxury font-serif">
            Premium metallic text effects
          </p>
        </div>
      </section>

      {/* Spacing */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl font-serif mb-8">Spacing System</h2>
        
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-20">space-1</span>
            <div className="h-4 bg-primary rounded" style={{ width: 'var(--space-1)' }}></div>
            <span className="text-xs text-muted-foreground">4px</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-20">space-2</span>
            <div className="h-4 bg-primary rounded" style={{ width: 'var(--space-2)' }}></div>
            <span className="text-xs text-muted-foreground">8px</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-20">space-3</span>
            <div className="h-4 bg-primary rounded" style={{ width: 'var(--space-3)' }}></div>
            <span className="text-xs text-muted-foreground">12px</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-20">space-4</span>
            <div className="h-4 bg-primary rounded" style={{ width: 'var(--space-4)' }}></div>
            <span className="text-xs text-muted-foreground">16px</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-20">space-6</span>
            <div className="h-4 bg-primary rounded" style={{ width: 'var(--space-6)' }}></div>
            <span className="text-xs text-muted-foreground">24px</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-20">space-8</span>
            <div className="h-4 bg-primary rounded" style={{ width: 'var(--space-8)' }}></div>
            <span className="text-xs text-muted-foreground">32px</span>
          </div>
        </div>
      </section>
    </div>
  )
}