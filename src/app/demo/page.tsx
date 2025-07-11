import { ShadcnDemo } from '@/components/ShadcnDemo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-12">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-4xl font-serif text-gradient-gold">
              Shadcn/UI Configuration Demo
            </CardTitle>
            <CardDescription className="text-lg">
              Luxury jewelry brand theme with custom colors and fonts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This demo showcases the shadcn/ui installation with a custom luxury brand aesthetic 
              designed for Ferreiras.Me jewelry collection.
            </p>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="font-semibold">Primary Font:</span> Playfair Display (Serif)
              </div>
              <div>
                <span className="font-semibold">Secondary Font:</span> Montserrat (Sans-serif)
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <ShadcnDemo />
      </div>
    </div>
  )
}