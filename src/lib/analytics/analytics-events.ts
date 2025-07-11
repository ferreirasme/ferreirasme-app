import { logEvent as gaLogEvent, trackFormSubmission as gaTrackForm, trackImageView as gaTrackImage, trackNewsletterSignup as gaTrackNewsletter, trackWhatsAppClick as gaTrackWhatsApp } from './google-analytics';
import { gtmEvent, gtmFormEvents, gtmEngagement, gtmEcommerce } from './google-tag-manager';
import { trackFacebookEvent } from './facebook-pixel';

// Analytics event types
export enum AnalyticsEventType {
  // Page events
  PAGE_VIEW = 'page_view',
  
  // Form events
  FORM_START = 'form_start',
  FORM_SUBMIT = 'form_submit',
  FORM_ERROR = 'form_error',
  
  // User engagement
  NEWSLETTER_SIGNUP = 'newsletter_signup',
  WHATSAPP_CLICK = 'whatsapp_click',
  SOCIAL_CLICK = 'social_click',
  IMAGE_VIEW = 'image_view',
  
  // E-commerce
  PRODUCT_VIEW = 'product_view',
  ADD_TO_CART = 'add_to_cart',
  PURCHASE = 'purchase',
  
  // Custom events
  CUSTOM = 'custom',
}

// Unified analytics interface
export interface AnalyticsEvent {
  type: AnalyticsEventType;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  customData?: Record<string, any>;
}

// Central analytics tracking function
export const trackEvent = (event: AnalyticsEvent) => {
  // Track in Google Analytics
  if (event.category && event.action) {
    gaLogEvent({
      category: event.category,
      action: event.action,
      label: event.label,
      value: event.value,
    });
  }

  // Track in GTM
  gtmEvent(event.type, {
    category: event.category,
    action: event.action,
    label: event.label,
    value: event.value,
    ...event.customData,
  });

  // Track in Facebook Pixel
  trackFacebookEvent(event.type, {
    category: event.category,
    action: event.action,
    label: event.label,
    value: event.value,
    ...event.customData,
  });
};

// Specific tracking functions that use all analytics providers
export const analytics = {
  // Page tracking
  pageView: (url?: string, title?: string) => {
    const pageUrl = url || window.location.pathname + window.location.search;
    
    // Track in all systems
    trackEvent({
      type: AnalyticsEventType.PAGE_VIEW,
      category: 'Page',
      action: 'View',
      label: pageUrl,
      customData: { title },
    });
  },

  // Form tracking
  form: {
    start: (formName: string) => {
      gtmFormEvents.formStart(formName);
      trackEvent({
        type: AnalyticsEventType.FORM_START,
        category: 'Form',
        action: 'Start',
        label: formName,
      });
    },

    submit: (formName: string, success: boolean = true) => {
      gaTrackForm(formName, success);
      gtmFormEvents.formSubmit(formName, success);
      trackFacebookEvent(success ? 'CompleteRegistration' : 'CustomEvent', {
        form_name: formName,
        status: success ? 'success' : 'error',
      });
    },

    fieldInteraction: (formName: string, fieldName: string) => {
      gtmFormEvents.formFieldInteraction(formName, fieldName);
    },
  },

  // User engagement
  engagement: {
    newsletterSignup: (email: string, success: boolean = true) => {
      gaTrackNewsletter(success);
      gtmEngagement.newsletterSignup(email, success);
      trackFacebookEvent('Subscribe', {
        success,
        predicted_ltv: 50, // Predicted lifetime value
      });
    },

    whatsappClick: () => {
      gaTrackWhatsApp();
      gtmEngagement.whatsappClick();
      trackFacebookEvent('Contact', {
        method: 'whatsapp',
      });
    },

    socialClick: (platform: string) => {
      gtmEngagement.socialClick(platform);
      trackEvent({
        type: AnalyticsEventType.SOCIAL_CLICK,
        category: 'Social',
        action: 'Click',
        label: platform,
      });
    },

    imageView: (imageName: string, imageCategory: string) => {
      gaTrackImage(imageName, imageCategory);
      gtmEngagement.imageView(imageName, imageCategory);
      trackFacebookEvent('ViewContent', {
        content_type: 'image',
        content_name: imageName,
        content_category: imageCategory,
      });
    },
  },

  // E-commerce tracking
  ecommerce: {
    productView: (product: {
      id: string;
      name: string;
      category: string;
      price: number;
      currency?: string;
    }) => {
      gtmEcommerce.viewItem(product);
      trackFacebookEvent('ViewContent', {
        content_ids: [product.id],
        content_name: product.name,
        content_category: product.category,
        value: product.price,
        currency: product.currency || 'BRL',
      });
    },

    addToCart: (product: {
      id: string;
      name: string;
      category: string;
      price: number;
      quantity: number;
      currency?: string;
    }) => {
      gtmEcommerce.addToCart(product);
      trackFacebookEvent('AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price * product.quantity,
        currency: product.currency || 'BRL',
        quantity: product.quantity,
      });
    },

    purchase: (transaction: {
      id: string;
      value: number;
      currency?: string;
      items: Array<{
        id: string;
        name: string;
        category: string;
        price: number;
        quantity: number;
      }>;
    }) => {
      gtmEcommerce.purchase(transaction);
      trackFacebookEvent('Purchase', {
        value: transaction.value,
        currency: transaction.currency || 'BRL',
        content_ids: transaction.items.map(item => item.id),
        content_type: 'product',
        num_items: transaction.items.reduce((sum, item) => sum + item.quantity, 0),
      });
    },
  },

  // Custom event
  custom: (eventName: string, data?: Record<string, any>) => {
    trackEvent({
      type: AnalyticsEventType.CUSTOM,
      category: data?.category || 'Custom',
      action: data?.action || eventName,
      label: data?.label,
      value: data?.value,
      customData: data,
    });
  },
};

// Conversion tracking helper
export const trackConversion = (conversionType: string, value?: number, additionalData?: Record<string, any>) => {
  // Track as custom event with conversion category
  trackEvent({
    type: AnalyticsEventType.CUSTOM,
    category: 'Conversion',
    action: conversionType,
    value,
    customData: {
      conversion: true,
      conversion_type: conversionType,
      ...additionalData,
    },
  });

  // Also track in Facebook as custom conversion
  trackFacebookEvent('CustomConversion', {
    conversion_type: conversionType,
    value,
    ...additionalData,
  });
};