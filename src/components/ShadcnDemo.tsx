'use client'

import { Button } from "@/components/ui/button"

export function ShadcnDemo() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h2 className="text-2xl font-serif mb-4 text-foreground">Shadcn/UI Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-serif mb-4 text-foreground">Luxury Brand Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="luxury">Luxury Gradient</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-serif mb-4 text-foreground">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm" variant="primary">Small</Button>
          <Button size="md" variant="primary">Medium</Button>
          <Button size="lg" variant="primary">Large</Button>
          <Button size="xl" variant="primary">Extra Large</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-serif mb-4 text-foreground">Typography</h2>
        <div className="space-y-2">
          <p className="font-serif text-3xl text-foreground">Playfair Display - Elegant Serif</p>
          <p className="font-sans text-lg text-muted-foreground">Montserrat - Modern Sans-serif</p>
          <p className="text-gold text-lg">Gold Color Text</p>
          <p className="text-rose-gold text-lg">Rose Gold Color Text</p>
          <p className="text-champagne text-lg">Champagne Color Text</p>
          <p className="text-platinum text-lg">Platinum Color Text</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-serif mb-4 text-foreground">Gradient Text</h2>
        <h1 className="text-4xl font-serif font-bold text-gradient-gold">
          Ferreiras.Me Luxury Jewelry
        </h1>
      </div>
    </div>
  )
}