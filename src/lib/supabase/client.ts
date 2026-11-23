import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== '' &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('dummy-url') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  );
};

// createBrowserClient from @supabase/ssr automatically writes session cookies to document.cookie
// so that Next.js middleware and Server Components can immediately read it!
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
