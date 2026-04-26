import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Ye session refresh karega taake API route aur private pages ko user mil jaye
  return await updateSession(request)
}

// 👇🔥 THE MASTERSTROKE: VERCEL CACHE SAVER 🔥👇
export const config = {
  // Ab middleware sirf in private pages par chalega.
  // Homepage (/), /jobs, /companies par yeh touch bhi nahi karega!
  matcher: [
    '/profile/:path*',
    '/history/:path*',
    '/admin/:path*',
    '/post-job/:path*',
    '/onboarding/:path*',
    '/complete-profile/:path*'
  ],
}
