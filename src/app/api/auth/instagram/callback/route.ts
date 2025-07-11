import { NextRequest, NextResponse } from 'next/server'
import { getInstagramAccessToken, getInstagramUserProfile } from '@/lib/instagram'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    // Handle errors from Instagram
    if (error) {
      console.error('Instagram OAuth error:', error, errorDescription)
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(errorDescription || error)}`, request.url)
      )
    }
    
    if (!code) {
      return NextResponse.redirect(
        new URL('/?error=No authorization code received', request.url)
      )
    }
    
    // Exchange code for access token
    const tokenResponse = await getInstagramAccessToken(code, {
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      redirectUri: process.env.INSTAGRAM_REDIRECT_URI
    })
    
    // Get user profile to verify the token works
    const userProfile = await getInstagramUserProfile(tokenResponse.access_token)
    
    // In a production app, you would:
    // 1. Store the access token securely (encrypted in database)
    // 2. Associate it with the user session
    // 3. Set up a job to refresh the token before it expires
    
    // For now, we'll store it in an HTTP-only cookie (not recommended for production)
    const response = NextResponse.redirect(new URL('/?instagram=connected', request.url))
    
    // Set secure cookie with token info
    response.cookies.set('instagram_token', tokenResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 60 // 60 days
    })
    
    response.cookies.set('instagram_user', userProfile.username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 60 // 60 days
    })
    
    return response
    
  } catch (error) {
    console.error('Error in Instagram callback:', error)
    return NextResponse.redirect(
      new URL('/?error=Failed to connect Instagram', request.url)
    )
  }
}