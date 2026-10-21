import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

const ATS_HOST = 'ats.hireskys.com'
const MAIN_ORIGIN = 'https://www.hireskys.com'

// Job board ke public sections — ye ATS subdomain par nahi chalenge,
// wahan se visitor asal board (www.hireskys.com) par chala jayega,
// taake subdomain bilkul ek alag ATS product lage.
const BOARD_SECTIONS = [
  '/jobs',
  '/companies',
  '/blog',
  '/category',
  '/remote-jobs',
  '/tools',
  '/career-advice',
  '/salary-guide',
]

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''

  if (host === ATS_HOST) {
    const { pathname, search } = request.nextUrl

    // Subdomain ki apni SEO files (asal site ki robots/sitemap mehfooz rehti hain)
    if (pathname === '/robots.txt') {
      const url = request.nextUrl.clone()
      url.pathname = '/ats-robots.txt'
      return NextResponse.rewrite(url)
    }
    if (pathname === '/sitemap.xml') {
      const url = request.nextUrl.clone()
      url.pathname = '/ats-sitemap.xml'
      return NextResponse.rewrite(url)
    }

    // ats.hireskys.com/  ->  andar se /ats-home wali screen (URL saaf rehta hai)
    // /ats-home ki apni SEO pehchan hai (canonical/OG sab ats.hireskys.com par)
    if (pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/ats-home'
      return NextResponse.rewrite(url)
    }

    // ats.hireskys.com/ats  ->  root par bhej do taake URL saaf rahe
    if (pathname === '/ats' || pathname === '/ats/') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Board wale hisse asal site par bhejo
    const isBoardSection = BOARD_SECTIONS.some(
      (section) => pathname === section || pathname.startsWith(`${section}/`)
    )
    if (isBoardSection) {
      return NextResponse.redirect(`${MAIN_ORIGIN}${pathname}${search}`)
    }

    // Baqi sab (/employer, /login, /apply, /api waghera) yahi chalega,
    // private paths par session refresh ke sath
    return await updateSession(request)
  }

  // Ye session refresh karega taake API route aur private pages ko user mil jaye
  return await updateSession(request)
}

// 👇🔥 THE MASTERSTROKE: VERCEL CACHE SAVER 🔥👇
export const config = {
  // Asal domain par middleware sirf in private pages par chalega (pehle jaisa hi).
  // Homepage (/), /jobs, /companies par yeh touch bhi nahi karega!
  matcher: [
    '/profile/:path*',
    '/history/:path*',
    '/admin/:path*',
    '/post-job/:path*',
    '/onboarding/:path*',
    '/complete-profile/:path*',
    // ATS subdomain ke liye: hr ghair-static path, LEKIN sirf usi host par —
    // asal site ki requests is se bilkul mutaasir nahi hongi.
    {
      source:
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|ico)$).*)',
      has: [{ type: 'host', value: 'ats.hireskys.com' }],
    },
  ],
}
