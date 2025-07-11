# Instagram Integration Setup Guide

This guide will help you set up Instagram integration for the Ferreiras.Me website.

## Overview

The Instagram integration allows the website to display the latest posts from @ferreirasme Instagram account. The implementation includes:

- Instagram feed component with elegant styling
- API route with caching to avoid rate limits
- Fallback mechanism when API is unavailable
- OAuth authentication flow for Instagram
- Automatic token refresh capability

## Features

1. **Instagram Feed Display**: Shows the latest 6 posts from the Instagram account
2. **Caching**: 1-hour cache to minimize API calls and avoid rate limits
3. **Fallback Mode**: Uses local images when Instagram API is unavailable
4. **Responsive Design**: Looks great on all devices
5. **Hover Effects**: Interactive overlays showing post details

## Setup Instructions

### 1. Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Consumer" as the app type
4. Fill in the app details:
   - App Name: "Ferreiras.Me Instagram"
   - App Contact Email: your email
   - App Purpose: Select appropriate purpose

### 2. Add Instagram Basic Display Product

1. In your Facebook app dashboard, click "Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Click "Create New App" under Instagram Basic Display
4. Fill in the Display Name (e.g., "Ferreiras.Me Instagram Feed")

### 3. Configure Instagram App Settings

1. Go to Instagram Basic Display → Basic Display
2. Add the following OAuth Redirect URI:
   ```
   https://your-domain.com/api/auth/instagram/callback
   ```
   For local development:
   ```
   https://localhost:3000/api/auth/instagram/callback
   ```

3. Add Deauthorize Callback URL:
   ```
   https://your-domain.com/api/auth/instagram/deauthorize
   ```

4. Add Data Deletion Request URL:
   ```
   https://your-domain.com/api/auth/instagram/delete
   ```

### 4. Get App Credentials

1. In Instagram Basic Display → Basic Display, you'll find:
   - Instagram App ID (use as CLIENT_ID)
   - Instagram App Secret (use as CLIENT_SECRET)

### 5. Configure Environment Variables

Create or update your `.env.local` file:

```env
# Instagram API Configuration
INSTAGRAM_CLIENT_ID=your_instagram_app_id
INSTAGRAM_CLIENT_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=https://your-domain.com/api/auth/instagram/callback

# For frontend use
NEXT_PUBLIC_INSTAGRAM_CLIENT_ID=your_instagram_app_id
NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI=https://your-domain.com/api/auth/instagram/callback
```

### 6. Add Test Users (Development Only)

1. Go to Instagram Basic Display → Roles → Roles
2. Add Instagram Test Users
3. Accept the invitation from the test user's Instagram account

### 7. Generate Access Token

There are two ways to connect Instagram:

#### Option A: Manual Token (Quick Setup)
1. Go to Instagram Basic Display → User Token Generator
2. Select your test user
3. Click "Generate Token"
4. Copy the token and add to `.env.local`:
   ```env
   INSTAGRAM_ACCESS_TOKEN=your_generated_token
   ```

#### Option B: OAuth Flow (Production)
1. Deploy the website with the environment variables
2. Navigate to your website
3. An admin interface will be available to connect Instagram
4. Click "Connect Instagram Account"
5. Authorize the app on Instagram
6. The token will be stored automatically

## Important Notes

### API Deprecation
The Instagram Basic Display API was deprecated on December 4, 2024. The current implementation includes:
- Fallback to local images when API is unavailable
- Support for the new Instagram API with Instagram Login
- Future-proof architecture for API changes

### Account Requirements
- Instagram account must be a Professional account (Business or Creator)
- Personal accounts are no longer supported by Instagram's API

### Rate Limits
- The implementation includes 1-hour caching to minimize API calls
- Instagram API has rate limits, so caching is essential

### Token Expiration
- Instagram access tokens expire after 60 days
- Long-lived tokens need to be refreshed before expiration
- The implementation includes token refresh capability

## Troubleshooting

### "Instagram access token not configured"
- Ensure you've added the `INSTAGRAM_ACCESS_TOKEN` to your environment variables
- Restart your development server after adding environment variables

### "Failed to fetch Instagram posts"
- Check if your Instagram account is set to Professional (Business/Creator)
- Verify your access token is valid and not expired
- Check the browser console for specific error messages

### Images not loading
- Ensure your Instagram posts are public
- Check if the media URLs are accessible
- Verify CORS settings if hosting on a different domain

## Production Deployment

When deploying to production (e.g., Vercel):

1. Add all environment variables to your hosting platform
2. Update OAuth Redirect URIs in Facebook App settings
3. Remove test users and add real Instagram accounts
4. Submit your app for App Review if needed (for public use)

## Security Considerations

1. Never expose your `INSTAGRAM_CLIENT_SECRET` in client-side code
2. Always use HTTPS for OAuth redirect URIs
3. Store access tokens securely (preferably encrypted in a database)
4. Implement proper error handling to avoid exposing sensitive information

## Future Enhancements

Consider implementing:
1. Database storage for tokens with encryption
2. Automatic token refresh background job
3. Webhook support for real-time updates
4. Analytics tracking for Instagram engagement
5. Multiple account support