import { supabase } from './supabase'

export async function getNewsletterSubscribersDebug() {
  const debugInfo = {
    hasClient: !!supabase,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    results: null as any,
    error: null as any,
    rawResponse: null as any
  }

  if (!supabase) {
    debugInfo.error = 'Supabase client not initialized'
    return debugInfo
  }

  try {
    // Tentar query direta
    const { data, error, status, statusText } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false })

    debugInfo.results = {
      data,
      error,
      status,
      statusText,
      count: data?.length || 0
    }

    if (error) {
      debugInfo.error = {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      }
    }

    // Tentar também uma chamada REST direta
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/newsletter_subscribers?select=*&order=subscribed_at.desc`,
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        }
      )

      const responseData = await response.json()
      
      debugInfo.rawResponse = {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData
      }
    } catch (fetchError: any) {
      debugInfo.rawResponse = {
        error: fetchError.message
      }
    }

  } catch (err: any) {
    debugInfo.error = {
      type: 'exception',
      message: err.message,
      stack: err.stack
    }
  }

  return debugInfo
}