// constants/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

export const supabase = createClient(
  'https://xkesystyxarmnulkngye.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZXN5c3R5eGFybW51bGtuZ3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTQzMDMsImV4cCI6MjA2NTc5MDMwM30.fsjFbV1A6S0E0HQx6-KMyOg7A2EEP09UoKhKbsSUBjU',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    }
  }
)
