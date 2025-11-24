import { createServerClient } from '@supabase/ssr';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export function createSupabaseServerClient(request: Request) {
  const headers = new Headers();

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const cookieHeader = request.headers.get('Cookie');
        if (!cookieHeader) return [];
        
        return cookieHeader.split(';').map(cookie => {
          const [name, value] = cookie.trim().split('=');
          return { name, value };
        });
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookieString = `${name}=${value}; Path=${options?.path || '/'}; ${
            options?.maxAge ? `Max-Age=${options.maxAge};` : ''
          } ${options?.httpOnly ? 'HttpOnly;' : ''} ${
            options?.secure ? 'Secure;' : ''
          } ${options?.sameSite ? `SameSite=${options.sameSite};` : ''}`;
          headers.append('Set-Cookie', cookieString);
        });
      },
    },
  });

  return { supabase, headers };
}

export async function getServerSession(request: Request) {
  const { supabase, headers } = createSupabaseServerClient(request);
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { session, supabase, headers };
}
