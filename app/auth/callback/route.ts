import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect') || '/dashboard'
  const error = searchParams.get('error')

  if (error) {
    console.error('[v0] OAuth error:', error)
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('[v0] Code exchange error:', exchangeError)
      return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(exchangeError.message)}`)
    }

    console.log('[v0] OAuth authentication successful, redirecting to:', redirect)
    
    const finalRedirect = redirect && redirect !== 'undefined' ? redirect : '/dashboard'
    return NextResponse.redirect(`${origin}${finalRedirect}`)
  }

  console.log('[v0] No code provided in OAuth callback')
  return NextResponse.redirect(`${origin}/auth/login`)
}
