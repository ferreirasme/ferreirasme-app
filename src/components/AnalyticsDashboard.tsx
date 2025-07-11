'use client';

import { useState, useEffect } from 'react';
import { useCookieConsent } from './CookieConsent';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: string;
  bounceRate: string;
  topPages: { path: string; views: number }[];
  conversions: { type: string; count: number }[];
  recentEvents: { timestamp: string; event: string; details?: string }[];
}

export const AnalyticsDashboard: React.FC = () => {
  const { consentGiven, preferences } = useCookieConsent();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  useEffect(() => {
    // In a real implementation, this would fetch data from your analytics APIs
    // For now, we'll use mock data
    const fetchAnalyticsData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in production, this would come from GA4 API, GTM, etc.
      setAnalyticsData({
        pageViews: 12543,
        uniqueVisitors: 3421,
        averageSessionDuration: '3:24',
        bounceRate: '42.3%',
        topPages: [
          { path: '/', views: 4521 },
          { path: '/produtos', views: 2341 },
          { path: '/contato', views: 1832 },
          { path: '/sobre', views: 921 },
        ],
        conversions: [
          { type: 'Newsletter Signup', count: 234 },
          { type: 'Contact Form', count: 89 },
          { type: 'WhatsApp Click', count: 156 },
          { type: 'Product View', count: 892 },
        ],
        recentEvents: [
          { timestamp: '2024-01-15 14:32', event: 'form_submit', details: 'Contact Form' },
          { timestamp: '2024-01-15 14:28', event: 'newsletter_signup', details: 'Footer Form' },
          { timestamp: '2024-01-15 14:25', event: 'whatsapp_click' },
          { timestamp: '2024-01-15 14:21', event: 'image_view', details: 'semijoias/ring-01' },
        ],
      });
      
      setLoading(false);
    };

    if (consentGiven && preferences?.analytics) {
      fetchAnalyticsData();
    } else {
      setLoading(false);
    }
  }, [consentGiven, preferences, timeRange]);

  if (!consentGiven || !preferences?.analytics) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Analytics Dashboard Indisponível
        </h3>
        <p className="text-yellow-700">
          Para visualizar os dados de analytics, você precisa aceitar os cookies de análise.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center text-gray-500">
        Nenhum dado de analytics disponível.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with time range selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === '24h' ? 'Últimas 24h' : range === '7d' ? 'Últimos 7 dias' : 'Últimos 30 dias'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Visualizações</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {analyticsData.pageViews.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Visitantes Únicos</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {analyticsData.uniqueVisitors.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Duração Média</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{analyticsData.averageSessionDuration}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Taxa de Rejeição</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{analyticsData.bounceRate}</p>
        </div>
      </div>

      {/* Top Pages and Conversions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Páginas Mais Visitadas</h3>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{page.path}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${(page.views / analyticsData.topPages[0].views) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {page.views.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversões</h3>
          <div className="space-y-3">
            {analyticsData.conversions.map((conversion, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{conversion.type}</span>
                <span className="text-2xl font-semibold text-yellow-600">
                  {conversion.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Eventos Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Horário</th>
                <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Evento</th>
                <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.recentEvents.map((event, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-600">{event.timestamp}</td>
                  <td className="py-2 px-4 text-sm font-medium text-gray-800">{event.event}</td>
                  <td className="py-2 px-4 text-sm text-gray-600">{event.details || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Provider Status */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Status dos Provedores</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${preferences?.analytics ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-700">Google Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${preferences?.analytics ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-700">Google Tag Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${preferences?.marketing ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-700">Facebook Pixel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${preferences?.analytics ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-700">Microsoft Clarity</span>
          </div>
        </div>
      </div>
    </div>
  );
};