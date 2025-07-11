'use client';

import { GoogleAnalyticsProvider } from '@/lib/analytics/google-analytics';
import { GoogleTagManager } from '@/lib/analytics/google-tag-manager';
import { FacebookPixelProvider } from '@/lib/analytics/facebook-pixel';
import { MicrosoftClarityProvider } from '@/lib/analytics/microsoft-clarity';
import { CookieConsent } from './CookieConsent';

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <GoogleTagManager />
      <GoogleAnalyticsProvider>
        <FacebookPixelProvider>
          <MicrosoftClarityProvider>
            {children}
            <CookieConsent />
          </MicrosoftClarityProvider>
        </FacebookPixelProvider>
      </GoogleAnalyticsProvider>
    </>
  );
};