import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 👇🔥 THE REVOLUTIONARY FIX:
  // Agar user Homepage, Jobs, ya Companies wale public pages par hai,
  // toh 'getUser()' ko skip kardo taake Vercel page ko CACHE kar sakay.
  
  const path = request.nextUrl.pathname;
  const isPublicPage = path === '/' || path.startsWith('/jobs') || path.startsWith('/companies') || path.startsWith('/talent');

  if (!isPublicPage) {
      // Sirf private pages (Profile, Admin, etc.) par session refresh karo
      await supabase.auth.getUser()
  }

  return response
}
