'use client';

import { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    clarity: (command: string, ...args: any[]) => void;
  }
}

// Initialize Microsoft Clarity
export const initClarity = () => {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  
  if (clarityId && typeof window !== 'undefined') {
    // Initialize Clarity
    (function(c: any, l: any, a: any, r: any, i: any) {
      let t: any, y: any;
      c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", clarityId);
  }
};

// Clarity custom events
export const clarityEvents = {
  // Set custom tags
  setTag: (key: string, value: string | number | boolean) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('set', key, value);
    }
  },

  // Identify user (anonymized)
  identify: (userId: string, sessionId?: string, customData?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('identify', userId, sessionId, customData);
    }
  },

  // Track custom events
  event: (eventName: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', eventName);
    }
  },

  // Upgrade session (mark as important)
  upgrade: (reason: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('upgrade', reason);
    }
  },

  // Set custom dimensions
  setDimension: (dimensionName: string, value: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('set', dimensionName, value);
    }
  },
};

// Specific Clarity tracking functions
export const clarityTracking = {
  // Track user type
  setUserType: (userType: 'visitor' | 'lead' | 'customer') => {
    clarityEvents.setTag('user_type', userType);
  },

  // Track page category
  setPageCategory: (category: string) => {
    clarityEvents.setTag('page_category', category);
  },

  // Track form interactions
  trackFormInteraction: (formName: string, action: 'start' | 'complete' | 'abandon') => {
    clarityEvents.event(`form_${action}_${formName}`);
    clarityEvents.setTag('last_form_action', `${formName}_${action}`);
  },

  // Track e-commerce events
  trackEcommerceEvent: (eventType: 'view_product' | 'add_to_cart' | 'purchase', value?: number) => {
    clarityEvents.event(eventType);
    if (value) {
      clarityEvents.setTag('last_ecommerce_value', value);
    }
  },

  // Track user engagement
  trackEngagement: (engagementType: 'high' | 'medium' | 'low') => {
    clarityEvents.setTag('engagement_level', engagementType);
  },

  // Track conversion funnel stage
  trackFunnelStage: (stage: 'awareness' | 'interest' | 'consideration' | 'conversion') => {
    clarityEvents.setTag('funnel_stage', stage);
    clarityEvents.event(`funnel_${stage}`);
  },

  // Mark session as important (for specific analysis)
  markImportantSession: (reason: string) => {
    clarityEvents.upgrade(reason);
  },
};

// Microsoft Clarity Provider Component
export const MicrosoftClarityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  useEffect(() => {
    if (clarityId && typeof window !== 'undefined') {
      initClarity();
      
      // Set initial tags
      clarityTracking.setUserType('visitor');
      clarityEvents.setTag('site_version', '1.0.0');
    }
  }, [clarityId]);

  if (!clarityId) {
    return <>{children}</>;
  }

  return (
    <>
      <Script
        id="clarity-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `,
        }}
      />
      {children}
    </>
  );
};