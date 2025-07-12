import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Durante o build, as variáveis podem não estar disponíveis
// Criamos um cliente dummy para evitar erros
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any

// Types for our database
export interface NewsletterSubscriber {
  id?: string
  email: string
  subscribed_at: string
  confirmed: boolean
  confirmed_at?: string
  ip_address?: string
  user_agent?: string
}