import { supabase, NewsletterSubscriber } from './supabase'

export async function saveNewsletterSubscriber(email: string, ipAddress?: string, userAgent?: string) {
  // Se não houver cliente Supabase, retornar sucesso silenciosamente
  if (!supabase) {
    console.warn('Supabase not configured, skipping database save')
    return { success: true, data: null }
  }
  
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email,
          subscribed_at: new Date().toISOString(),
          confirmed: false,
          ip_address: ipAddress,
          user_agent: userAgent
        }
      ])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error saving subscriber:', error)
    return { success: false, error }
  }
}

export async function confirmNewsletterSubscriber(email: string) {
  if (!supabase) {
    console.warn('Supabase not configured, skipping database update')
    return { success: true, data: null }
  }
  
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({ 
        confirmed: true, 
        confirmed_at: new Date().toISOString() 
      })
      .eq('email', email)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error confirming subscriber:', error)
    return { success: false, error }
  }
}

export async function getNewsletterSubscribers(onlyConfirmed: boolean = true) {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty list')
    return { success: true, data: [] }
  }
  
  try {
    let query = supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false })

    if (onlyConfirmed) {
      query = query.eq('confirmed', true)
    }

    const { data, error } = await query

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return { success: false, error }
  }
}

export async function checkSubscriberExists(email: string) {
  if (!supabase) {
    console.warn('Supabase not configured, returning not exists')
    return { exists: false, confirmed: false }
  }
  
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('email, confirmed')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return { exists: !!data, confirmed: data?.confirmed || false }
  } catch (error) {
    console.error('Error checking subscriber:', error)
    return { exists: false, confirmed: false }
  }
}