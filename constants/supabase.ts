// constants/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://flmmhhvrocielmolvfmfk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
