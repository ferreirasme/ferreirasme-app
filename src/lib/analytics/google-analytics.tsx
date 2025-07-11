'use client';

import { useEffect } from 'react';
import ReactGA from 'react-ga4';

export interface GAEventProps {
  action: string;
  category: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
  transport?: 'beacon' | 'xhr' | 'image';
}

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  
  if (measurementId) {
    ReactGA.initialize(measurementId, {
      gaOptions: {
        anonymizeIp: true, // GDPR compliance
        cookieFlags: 'SameSite=None;Secure',
      },
    });
  }
};

// Send pageview
export const logPageView = (url?: string) => {
  if (typeof window !== 'undefined') {
    ReactGA.send({
      hitType: 'pageview',
      page: url || window.location.pathname + window.location.search,
    });
  }
};

// Send custom event
export const logEvent = ({
  action,
  category,
  label,
  value,
  nonInteraction,
  transport,
}: GAEventProps) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
    nonInteraction,
    transport,
  });
};

// Specific event tracking functions
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  logEvent({
    category: 'Form',
    action: success ? 'Submit Success' : 'Submit Error',
    label: formName,
  });
};

export const trackImageView = (imageName: string, imageCategory: string) => {
  logEvent({
    category: 'Image',
    action: 'View',
    label: `${imageCategory}/${imageName}`,
  });
};

export const trackNewsletterSignup = (success: boolean = true) => {
  logEvent({
    category: 'Newsletter',
    action: success ? 'Signup Success' : 'Signup Error',
    label: 'Newsletter Form',
  });
};

export const trackWhatsAppClick = () => {
  logEvent({
    category: 'Contact',
    action: 'Click',
    label: 'WhatsApp Button',
  });
};

export const trackProductView = (productId: string, productName: string) => {
  logEvent({
    category: 'Product',
    action: 'View',
    label: productName,
    value: productId ? parseInt(productId, 10) : undefined,
  });
};

// E-commerce specific events
export const trackPurchase = (transactionId: string, value: number, currency: string = 'BRL') => {
  ReactGA.event({
    category: 'ecommerce',
    action: 'purchase',
    value,
    label: `Transaction: ${transactionId} - Currency: ${currency}`,
  });
};

export const trackAddToCart = (productId: string, productName: string, value: number) => {
  ReactGA.event({
    category: 'ecommerce',
    action: 'add_to_cart',
    label: productName,
    value,
  });
};

// Google Analytics Provider Component
export const GoogleAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initGA();
      logPageView();
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      logPageView(url);
    };

    // Listen to route changes
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => handleRouteChange(window.location.pathname));
      
      return () => {
        window.removeEventListener('popstate', () => handleRouteChange(window.location.pathname));
      };
    }
  }, []);

  return <>{children}</>;
};