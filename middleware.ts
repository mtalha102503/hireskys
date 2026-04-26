import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Ye session refresh karega taake API route ko user mil jaye
  return await updateSession(request)
}

// 👇🔥 THE MASTERSTROKE: VERCEL CACHE SAVER 🔥👇
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT for the ones starting with:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     * 4. api (Taake Webhooks aur APIs cache block na karein)
     * 5. jobs (Jobs pages static rahen)
     * 6. companies (Companies pages static rahen)
     * 7. talent (Talent directory static rahay)
     * 8. Exact root '/' ($ sign ki madad se Homepage exclude kiya)
     * 9. Image files (.svg, .png, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|jobs|companies|talent|$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
