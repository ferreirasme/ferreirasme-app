'use client';

import { useState, useEffect } from 'react';
import CookieConsentLib from 'react-cookie-consent';
import Cookies from 'js-cookie';
import { initGA } from '@/lib/analytics/google-analytics';
import { initFacebookPixel } from '@/lib/analytics/facebook-pixel';
import { initClarity } from '@/lib/analytics/microsoft-clarity';
import { initGTM } from '@/lib/analytics/google-tag-manager';

export type CookieCategory = 'necessary' | 'analytics' | 'marketing' | 'preferences';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const COOKIE_NAME = 'ferreirasme-cookie-consent';
const COOKIE_PREFERENCES_NAME = 'ferreirasme-cookie-preferences';

export const CookieConsent: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: true,
    marketing: true,
    preferences: true,
  });

  useEffect(() => {
    // Check if user has already consented
    const consent = Cookies.get(COOKIE_NAME);
    const savedPreferences = Cookies.get(COOKIE_PREFERENCES_NAME);

    if (consent === 'true' && savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences) as CookiePreferences;
        setPreferences(prefs);
        initializeAnalytics(prefs);
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, []);

  const initializeAnalytics = (prefs: CookiePreferences) => {
    // Initialize analytics based on preferences
    if (prefs.analytics) {
      initGA();
      initGTM();
      initClarity();
    }

    if (prefs.marketing) {
      initFacebookPixel();
    }
  };

  const handleAcceptAll = () => {
    const allAcceptedPrefs: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    savePreferences(allAcceptedPrefs);
    initializeAnalytics(allAcceptedPrefs);
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
    initializeAnalytics(preferences);
  };

  const handleDeclineAll = () => {
    const minimalPrefs: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    savePreferences(minimalPrefs);
    // Don't initialize any analytics
  };

  const savePreferences = (prefs: CookiePreferences) => {
    Cookies.set(COOKIE_NAME, 'true', { expires: 365, sameSite: 'strict' });
    Cookies.set(COOKIE_PREFERENCES_NAME, JSON.stringify(prefs), { expires: 365, sameSite: 'strict' });
  };

  const togglePreference = (category: Exclude<CookieCategory, 'necessary'>) => {
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (process.env.NEXT_PUBLIC_COOKIE_CONSENT_ENABLED !== 'true') {
    // If cookie consent is disabled, initialize all analytics
    useEffect(() => {
      initializeAnalytics({
        necessary: true,
        analytics: true,
        marketing: true,
        preferences: true,
      });
    }, []);
    return null;
  }

  return (
    <CookieConsentLib
      location="bottom"
      cookieName={COOKIE_NAME}
      expires={365}
      overlay
      overlayClasses="fixed inset-0 bg-black/50 z-50"
      containerClasses="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-200"
      contentClasses="max-w-7xl mx-auto p-6"
      buttonWrapperClasses="flex flex-wrap gap-3 mt-4"
      enableDeclineButton
      flipButtons
      disableButtonStyles
      disableStyles
      customContainerAttributes={{
        role: 'dialog',
        'aria-label': 'Cookie consent',
      }}
      ButtonComponent={({ children, ...props }: any) => (
        <button
          {...props}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            props.id === 'rcc-confirm-button'
              ? 'bg-yellow-500 text-black hover:bg-yellow-600'
              : props.id === 'rcc-decline-button'
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {children}
        </button>
      )}
      onAccept={handleAcceptAll}
      onDecline={handleDeclineAll}
    >
      <div className="text-gray-800">
        <h2 className="text-2xl font-bold mb-3">Configurações de Cookies</h2>
        <p className="mb-4 text-gray-600">
          Utilizamos cookies para melhorar a sua experiência no nosso site. Alguns cookies são essenciais
          para o funcionamento do site, enquanto outros nos ajudam a compreender como interage
          com o nosso conteúdo.
        </p>

        {!showDetails ? (
          <button
            onClick={() => setShowDetails(true)}
            className="text-yellow-600 hover:text-yellow-700 underline mb-4"
          >
            Personalizar definições
          </button>
        ) : (
          <div className="space-y-4 mb-6">
            {/* Necessary Cookies */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Cookies Necessários</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Essenciais para o funcionamento do site. Não podem ser desativados.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="h-5 w-5 text-yellow-500"
                />
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Cookies de Análise</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Ajudam-nos a compreender como utiliza o site (Google Analytics, Clarity).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => togglePreference('analytics')}
                  className="h-5 w-5 text-yellow-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Cookies de Marketing</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Utilizados para mostrar anúncios relevantes (Facebook Pixel).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => togglePreference('marketing')}
                  className="h-5 w-5 text-yellow-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Preference Cookies */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Cookies de Preferências</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Lembram suas preferências e configurações personalizadas.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={() => togglePreference('preferences')}
                  className="h-5 w-5 text-yellow-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAcceptSelected}
                className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-600 transition-colors"
              >
                Aceitar selecionados
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 mt-4">
          Para mais informações, consulte a nossa{' '}
          <a
            href={process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL || '/privacy-policy'}
            className="text-yellow-600 hover:text-yellow-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Privacidade
          </a>{' '}
          e{' '}
          <a
            href={process.env.NEXT_PUBLIC_COOKIE_POLICY_URL || '/cookie-policy'}
            className="text-yellow-600 hover:text-yellow-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Cookies
          </a>
          .
        </div>
      </div>
    </CookieConsentLib>
  );
};

// Hook to check cookie consent status
export const useCookieConsent = () => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const consent = Cookies.get(COOKIE_NAME);
    const savedPreferences = Cookies.get(COOKIE_PREFERENCES_NAME);

    setConsentGiven(consent === 'true');

    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, []);

  return { consentGiven, preferences };
};