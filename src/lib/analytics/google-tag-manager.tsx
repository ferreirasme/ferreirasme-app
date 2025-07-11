'use client';

import { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface GTMPageViewEvent {
  event: string;
  page: string;
  title?: string;
}

interface GTMCustomEvent {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

// Initialize GTM
export const initGTM = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

// Push event to dataLayer
export const pushToDataLayer = (data: GTMPageViewEvent | GTMCustomEvent) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

// Track page view
export const gtmPageView = (url: string) => {
  pushToDataLayer({
    event: 'pageview',
    page: url,
    title: document.title,
  });
};

// Track custom events
export const gtmEvent = (eventName: string, parameters?: Record<string, any>) => {
  pushToDataLayer({
    event: eventName,
    ...parameters,
  });
};

// E-commerce events
export const gtmEcommerce = {
  // Track product view
  viewItem: (product: {
    id: string;
    name: string;
    category: string;
    price: number;
    currency?: string;
  }) => {
    pushToDataLayer({
      event: 'view_item',
      ecommerce: {
        currency: product.currency || 'BRL',
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: 1,
        }],
      },
    });
  },

  // Track add to cart
  addToCart: (product: {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    currency?: string;
  }) => {
    pushToDataLayer({
      event: 'add_to_cart',
      ecommerce: {
        currency: product.currency || 'BRL',
        value: product.price * product.quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: product.quantity,
        }],
      },
    });
  },

  // Track purchase
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
    pushToDataLayer({
      event: 'purchase',
      ecommerce: {
        transaction_id: transaction.id,
        value: transaction.value,
        currency: transaction.currency || 'BRL',
        items: transaction.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    });
  },
};

// Form tracking
export const gtmFormEvents = {
  // Track form start
  formStart: (formName: string) => {
    gtmEvent('form_start', {
      form_name: formName,
      category: 'Form',
      action: 'Start',
      label: formName,
    });
  },

  // Track form submission
  formSubmit: (formName: string, success: boolean = true) => {
    gtmEvent('form_submit', {
      form_name: formName,
      form_status: success ? 'success' : 'error',
      category: 'Form',
      action: success ? 'Submit Success' : 'Submit Error',
      label: formName,
    });
  },

  // Track form field interaction
  formFieldInteraction: (formName: string, fieldName: string) => {
    gtmEvent('form_field_interaction', {
      form_name: formName,
      field_name: fieldName,
      category: 'Form',
      action: 'Field Interaction',
      label: `${formName} - ${fieldName}`,
    });
  },
};

// User engagement tracking
export const gtmEngagement = {
  // Track newsletter signup
  newsletterSignup: (email: string, success: boolean = true) => {
    gtmEvent('newsletter_signup', {
      category: 'Newsletter',
      action: success ? 'Signup Success' : 'Signup Error',
      label: 'Newsletter Form',
      user_email_hash: email ? btoa(email) : undefined, // Basic hash for privacy
    });
  },

  // Track social media clicks
  socialClick: (platform: string) => {
    gtmEvent('social_click', {
      category: 'Social',
      action: 'Click',
      label: platform,
    });
  },

  // Track WhatsApp click
  whatsappClick: () => {
    gtmEvent('whatsapp_click', {
      category: 'Contact',
      action: 'Click',
      label: 'WhatsApp Button',
    });
  },

  // Track image modal view
  imageView: (imageName: string, imageCategory: string) => {
    gtmEvent('image_view', {
      category: 'Content',
      action: 'Image View',
      label: `${imageCategory}/${imageName}`,
    });
  },
};

// Google Tag Manager Component
export const GoogleTagManager: React.FC = () => {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  useEffect(() => {
    initGTM();
  }, []);

  if (!gtmId) {
    return null;
  }

  return (
    <>
      {/* GTM Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
      
      {/* GTM NoScript */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
};