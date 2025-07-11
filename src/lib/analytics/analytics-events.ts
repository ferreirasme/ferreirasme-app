import { logEvent as gaLogEvent, trackFormSubmission as gaTrackForm, trackImageView as gaTrackImage, trackNewsletterSignup as gaTrackNewsletter, trackWhatsAppClick as gaTrackWhatsApp } from './google-analytics';
import { gtmEvent, gtmFormEvents, gtmEngagement } from './google-tag-manager';
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