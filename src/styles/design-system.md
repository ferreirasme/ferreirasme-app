# Ferreiras ME - Luxury Design System

## Overview

This design system is crafted specifically for Ferreiras ME, a high-end jewelry brand. It emphasizes elegance, luxury, and sophistication through carefully selected colors, typography, and visual elements that reflect the premium nature of fine jewelry.

## Core Design Principles

1. **Elegance**: Clean, refined aesthetics with subtle sophistication
2. **Luxury**: Premium feel through rich colors and smooth animations
3. **Clarity**: Clear hierarchy and excellent readability
4. **Consistency**: Unified visual language across all components

## Color Palette

### Primary Colors
- **Gold** (`--primary`): #FFD700 - The signature color representing luxury and premium quality
- **Primary Foreground**: White text on gold backgrounds

### Secondary Colors
- **Rose Gold** (`--secondary`): #B76E79 - Warm, elegant accent color
- **Secondary Foreground**: White text on rose gold backgrounds

### Accent Colors
- **Deep Burgundy** (`--accent`): #6B2C39 - Rich, sophisticated accent
- **Accent Foreground**: White text on burgundy backgrounds

### Luxury Specific Colors
- **Champagne** (`--champagne`): #E2D1B3 - Light, elegant neutral
- **Pearl** (`--pearl`): #F5F2EA - Soft, luxurious white
- **Onyx** (`--onyx`): #141414 - Deep, premium black
- **Bronze** (`--bronze`): #A67C52 - Antique metallic accent

### Neutral Colors
- **Background**: #FAFAFA - Off-white for main backgrounds
- **Foreground**: #1F1F1F - Charcoal for main text
- **Card**: Pure white for card backgrounds
- **Muted**: #F5F5F5 - Light gray for subtle elements
- **Border**: #E5E5E5 - Subtle borders

### Dark Mode
The design system includes a sophisticated dark mode that maintains the luxury feel:
- Onyx backgrounds with off-white text
- Preserved gold and rose gold accents
- Enhanced shadows for depth

## Typography

### Font Families
- **Sans-serif**: Inter - Modern, clean body text
- **Serif**: Playfair Display - Elegant headlines
- **Display**: Bodoni Moda - Luxury display text

### Type Scale
- `text-xs`: 12px - Fine print
- `text-sm`: 14px - Small text
- `text-base`: 16px - Body text
- `text-lg`: 18px - Large body text
- `text-xl`: 20px - Small headings
- `text-2xl`: 24px - Medium headings
- `text-3xl`: 30px - Large headings
- `text-4xl`: 36px - Display headings
- `text-5xl`: 48px - Hero headings
- `text-6xl`: 60px - Extra large display
- `text-7xl`: 72px - Maximum impact

### Font Weights
- `font-light`: 300 - Elegant headlines
- `font-normal`: 400 - Body text
- `font-medium`: 500 - Subtle emphasis
- `font-semibold`: 600 - Strong emphasis
- `font-bold`: 700 - Maximum emphasis

## Spacing System

Based on a 4px grid for consistency:
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 20px
- `space-6`: 24px
- `space-8`: 32px
- `space-10`: 40px
- `space-12`: 48px
- `space-16`: 64px
- `space-20`: 80px
- `space-24`: 96px

## Border Radius

- `rounded-sm`: 4px - Subtle rounding
- `rounded-md`: 8px - Standard rounding
- `rounded-lg`: 12px - Prominent rounding
- `rounded-xl`: 16px - Large rounding
- `rounded-2xl`: 24px - Extra large rounding
- `rounded-full`: 9999px - Circular elements

## Shadow System

### Standard Shadows
- `shadow-xs`: Minimal elevation
- `shadow-sm`: Subtle elevation
- `shadow-md`: Standard elevation
- `shadow-lg`: Prominent elevation
- `shadow-xl`: High elevation
- `shadow-2xl`: Maximum elevation

### Special Shadows
- `shadow-gold`: Gold glow effect
- `shadow-luxury`: Rose gold luxury shadow
- `shadow-inner`: Inset shadow for depth

## Animation System

### Durations
- `duration-instant`: 0ms
- `duration-fast`: 150ms
- `duration-normal`: 300ms
- `duration-slow`: 500ms
- `duration-slower`: 700ms
- `duration-slowest`: 1000ms

### Easing Functions
- `ease-linear`: Constant speed
- `ease-in`: Accelerate from zero
- `ease-out`: Decelerate to zero
- `ease-in-out`: Accelerate then decelerate
- `ease-luxury`: Custom luxury curve
- `ease-bounce`: Playful bounce effect

### Available Animations
- `animate-shimmer`: Shimmer effect for loading or highlights
- `animate-glow`: Glowing effect for emphasis
- `animate-float`: Gentle floating motion
- `animate-pulse-gold`: Gold pulsing effect
- `animate-fade-in/out`: Opacity transitions
- `animate-slide-in-*`: Directional slide animations
- `animate-zoom-in/out`: Scale transitions

## Component Variants

### Buttons
```html
<!-- Primary Button -->
<button class="btn-primary px-6 py-3 rounded-lg font-medium">
  Shop Now
</button>

<!-- Secondary Button -->
<button class="btn-secondary px-6 py-3 rounded-lg font-medium">
  Learn More
</button>

<!-- Accent Button -->
<button class="btn-accent px-6 py-3 rounded-lg font-medium">
  Contact Us
</button>

<!-- Outline Button -->
<button class="btn-outline px-6 py-3 rounded-lg font-medium">
  View Collection
</button>

<!-- Ghost Button -->
<button class="btn-ghost px-6 py-3 rounded-lg font-medium">
  Cancel
</button>

<!-- Luxury Button -->
<button class="btn-luxury px-8 py-4 rounded-xl font-semibold text-lg">
  Exclusive Access
</button>
```

### Cards
```html
<!-- Elegant Card -->
<div class="card-elegant p-6">
  <h3 class="text-xl font-serif mb-2">Diamond Collection</h3>
  <p class="text-muted-foreground">Exquisite pieces for special moments</p>
</div>

<!-- Luxury Card -->
<div class="card-luxury p-8">
  <h3 class="text-2xl font-display mb-3">Premium Selection</h3>
  <p class="text-foreground/80">Handcrafted with perfection</p>
</div>

<!-- Minimal Card -->
<div class="card-minimal p-4">
  <h4 class="font-medium">Quick Info</h4>
  <p class="text-sm text-muted-foreground">Essential details</p>
</div>
```

### Form Elements
```html
<!-- Elegant Input -->
<input type="text" class="input-elegant w-full" placeholder="Enter your email">

<!-- Luxury Input -->
<input type="text" class="input-luxury w-full" placeholder="Your name">
```

### Special Effects

#### Gradients
```html
<!-- Gold Gradient Background -->
<div class="gradient-gold p-8">
  Luxury Content
</div>

<!-- Text Gradient -->
<h1 class="text-6xl font-display text-gradient-gold">
  Exclusive Collection
</h1>
```

#### Glass Effect
```html
<!-- Light Glass -->
<div class="glass p-6 rounded-xl">
  Frosted glass effect
</div>

<!-- Dark Glass -->
<div class="glass-dark p-6 rounded-xl">
  Dark frosted glass
</div>
```

## Usage Examples

### Hero Section
```html
<section class="min-h-screen gradient-luxury flex items-center justify-center">
  <div class="text-center space-y-6">
    <h1 class="text-7xl font-display text-gradient-gold animate-fade-in">
      Ferreiras ME
    </h1>
    <p class="text-xl text-muted-foreground animate-slide-in-up">
      Luxury Redefined
    </p>
    <button class="btn-luxury px-10 py-4 rounded-2xl text-lg animate-zoom-in">
      Discover Collection
    </button>
  </div>
</section>
```

### Product Card
```html
<article class="card-luxury overflow-hidden group">
  <div class="aspect-square overflow-hidden">
    <img 
      src="/product.jpg" 
      alt="Diamond Necklace"
      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
    >
  </div>
  <div class="p-6 space-y-3">
    <h3 class="text-2xl font-serif">Diamond Elegance</h3>
    <p class="text-muted-foreground">18k White Gold</p>
    <p class="text-3xl font-light text-primary">$12,500</p>
    <button class="btn-primary w-full py-3 rounded-lg">
      Add to Collection
    </button>
  </div>
</article>
```

### Newsletter Form
```html
<div class="card-elegant p-8 max-w-md mx-auto">
  <h3 class="text-2xl font-serif mb-4">Stay Exclusive</h3>
  <p class="text-muted-foreground mb-6">
    Be the first to know about new collections
  </p>
  <form class="space-y-4">
    <input 
      type="email" 
      class="input-luxury w-full" 
      placeholder="your@email.com"
    >
    <button class="btn-primary w-full py-3 rounded-lg">
      Subscribe
    </button>
  </form>
</div>
```

## Best Practices

1. **Color Usage**
   - Use gold sparingly for maximum impact
   - Combine neutrals with accent colors
   - Maintain high contrast for readability

2. **Typography**
   - Use serif fonts for headlines
   - Keep body text in sans-serif
   - Limit font weights per page

3. **Spacing**
   - Use consistent spacing from the scale
   - Create visual hierarchy with space
   - Allow content to breathe

4. **Animation**
   - Keep animations subtle and smooth
   - Use appropriate duration for context
   - Avoid overwhelming the user

5. **Components**
   - Maintain consistent styling
   - Use appropriate variants for context
   - Consider accessibility in all designs

## Accessibility

- Ensure color contrast ratios meet WCAG standards
- Provide focus states for all interactive elements
- Use semantic HTML with components
- Include appropriate ARIA labels
- Test with screen readers

## Responsive Design

All components are designed to be responsive:
- Use responsive typography scales
- Adjust spacing for mobile devices
- Ensure touch targets are adequate
- Test across device sizes