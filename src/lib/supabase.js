import { createClient } from '@supabase/supabase-js'

// Projeto Supabase isolado, exclusivo deste app (nao compartilha dados/usuarios
// com o Supabase principal da plataforma LABTES).
const SUPABASE_URL = 'https://jdzfqeyvligbtichfrwm.supabase.co'
const SUPABASE_KEY = 'sb_publishable_u5SkBfWlKGKWLsIMBpobDA_nVbZM8U_'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
