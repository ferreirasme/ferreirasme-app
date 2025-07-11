# Analytics Setup Documentation for Ferreiras.Me

## Overview

This document provides comprehensive instructions for setting up and using the analytics system implemented in the Ferreiras.Me application. The system includes Google Analytics 4, Google Tag Manager, Facebook Pixel, and Microsoft Clarity, all with GDPR-compliant cookie consent.

## Quick Start

1. Copy `.env.local.example` to `.env.local`
2. Add your analytics IDs to the environment variables
3. Deploy your application
4. The cookie consent banner will appear on first visit

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Facebook Pixel
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=XXXXXXXXXXXXXXX

# Microsoft Clarity
NEXT_PUBLIC_CLARITY_PROJECT_ID=XXXXXXXXXX

# Cookie Consent Configuration
NEXT_PUBLIC_COOKIE_CONSENT_ENABLED=true
NEXT_PUBLIC_PRIVACY_POLICY_URL=/privacy-policy
NEXT_PUBLIC_COOKIE_POLICY_URL=/cookie-policy
```

## Analytics Providers Setup

### 1. Google Analytics 4

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Get your Measurement ID (format: G-XXXXXXXXXX)
4. Add it to `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### 2. Google Tag Manager

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new container
3. Get your GTM ID (format: GTM-XXXXXXX)
4. Add it to `NEXT_PUBLIC_GTM_ID`

### 3. Facebook Pixel

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Create a new pixel
3. Get your Pixel ID
4. Add it to `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`

### 4. Microsoft Clarity

1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Create a new project
3. Get your Project ID
4. Add it to `NEXT_PUBLIC_CLARITY_PROJECT_ID`

## Implemented Features

### Cookie Consent (GDPR Compliant)

- **Location**: Bottom of the page
- **Categories**:
  - Necessary (always enabled)
  - Analytics (GA4, GTM, Clarity)
  - Marketing (Facebook Pixel)
  - Preferences
- **Features**:
  - Customizable preferences
  - Persistent consent storage
  - Analytics only load after consent

### Event Tracking

The following events are automatically tracked:

#### Page Views
- Tracked on every route change
- Sent to: GA4, GTM, Facebook Pixel

#### Form Events
- **Contact Form**:
  - Form start
  - Field interactions
  - Submission (success/error)
  - Conversion tracking
- **Newsletter Form**:
  - Form start
  - Submission (success/error)
  - Conversion tracking

#### User Engagement
- **WhatsApp Button Clicks**:
  - Click tracking
  - Conversion tracking
- **Image Views**:
  - Modal opens
  - Image category tracking
- **Social Media Clicks**:
  - Platform tracking

#### E-commerce Events (Ready for implementation)
- Product views
- Add to cart
- Purchases

### Analytics Dashboard

Access the analytics dashboard by importing the component:

```tsx
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'

// Use in your admin panel or dedicated page
<AnalyticsDashboard />
```

Features:
- Key metrics display
- Top pages
- Conversion tracking
- Recent events
- Provider status

## Usage in Components

### Basic Event Tracking

```tsx
import { analytics, trackConversion } from '@/lib/analytics/analytics-events'

// Track a custom event
analytics.custom('button_click', {
  button_name: 'hero_cta',
  page: 'home'
})

// Track a conversion
trackConversion('Lead Generation', 100, {
  source: 'contact_form'
})
```

### Form Tracking Example

```tsx
// On form field change
analytics.form.fieldInteraction('Contact Form', fieldName)

// On form submit
analytics.form.start('Contact Form')

// On success
analytics.form.submit('Contact Form', true)
trackConversion('Contact Form Submission')

// On error
analytics.form.submit('Contact Form', false)
```

### E-commerce Tracking Example

```tsx
// Product view
analytics.ecommerce.productView({
  id: '123',
  name: 'Gold Necklace',
  category: 'Necklaces',
  price: 299.99
})

// Add to cart
analytics.ecommerce.addToCart({
  id: '123',
  name: 'Gold Necklace',
  category: 'Necklaces',
  price: 299.99,
  quantity: 1
})

// Purchase
analytics.ecommerce.purchase({
  id: 'order-123',
  value: 299.99,
  items: [{
    id: '123',
    name: 'Gold Necklace',
    category: 'Necklaces',
    price: 299.99,
    quantity: 1
  }]
})
```

## Privacy Compliance

### Cookie Consent Flow

1. First visit: Cookie consent banner appears
2. User can:
   - Accept all cookies
   - Customize preferences
   - Decline all (except necessary)
3. Preferences are stored for 365 days
4. Analytics only initialize after consent

### Data Privacy

- IP anonymization enabled in GA4
- User emails are hashed before sending
- No PII (Personally Identifiable Information) is sent
- All data transmission uses HTTPS

### User Rights

Users can:
- View current cookie preferences
- Change preferences at any time
- Request data deletion (implement separately)

## Testing Analytics

### Development Testing

1. Set environment variables in `.env.local`
2. Run `npm run dev`
3. Open browser developer tools
4. Check Network tab for analytics calls
5. Use browser extensions:
   - Google Tag Assistant
   - Facebook Pixel Helper

### Production Testing

1. Deploy to production
2. Use real analytics IDs
3. Monitor in:
   - Google Analytics real-time view
   - GTM Preview mode
   - Facebook Events Manager
   - Microsoft Clarity dashboard

## Troubleshooting

### Analytics not working

1. Check environment variables are set
2. Verify cookie consent is accepted
3. Check browser console for errors
4. Ensure ad blockers are disabled for testing

### Events not tracking

1. Check event names match documentation
2. Verify analytics providers are initialized
3. Use browser developer tools to inspect network calls
4. Check analytics dashboards for data delay

### Cookie consent issues

1. Clear browser cookies and localStorage
2. Check `NEXT_PUBLIC_COOKIE_CONSENT_ENABLED` is `true`
3. Verify consent component is rendered
4. Check for JavaScript errors

## Best Practices

1. **Event Naming**: Use consistent, descriptive event names
2. **Data Quality**: Validate data before sending to analytics
3. **Performance**: Batch events when possible
4. **Privacy**: Always hash sensitive data
5. **Testing**: Test in development before production
6. **Documentation**: Document custom events in your code

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review provider documentation
3. Check browser console for errors
4. Contact support with detailed error information