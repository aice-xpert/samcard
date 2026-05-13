# Supabase Auth Password Reset Integration Guide

## Overview

Your SamCard application now uses **Supabase Auth** for password reset functionality instead of custom token generation. This provides a more secure and managed approach to handling password resets.

## How It Works

### 1. **Forgot Password Flow**
- User enters their email on `/forgot-password`
- Frontend sends email to backend: `POST /api/auth/forgot-password`
- Backend calls `supabase.auth.admin.resetPasswordForEmail()`
- Supabase automatically sends a recovery email with a recovery link
- Recovery link redirects to: `https://samcard.vercel.com/reset-password?code=XXX`

### 2. **Reset Password Flow**
- User clicks the recovery link in email
- User is redirected to `/reset-password?code=XXX` with the recovery code
- User enters new password and confirms
- Frontend sends the code and new password to backend: `POST /api/auth/reset-password`
- Backend exchanges the code for a session: `supabase.auth.exchangeCodeForSession(code)`
- Backend updates the password: `supabase.auth.admin.updateUserById(userId, { password })`
- User receives confirmation and is redirected to login

## Files Updated

### Backend Files
1. **[backend/auth/forgot-password.ts](backend/auth/forgot-password.ts)**
   - Now uses `supabase.auth.admin.resetPasswordForEmail()` instead of custom tokens
   - Removed custom email sending (Supabase handles it)
   - Removed database token storage

2. **[backend/auth/reset-password.ts](backend/auth/reset-password.ts)**
   - Now accepts `code` parameter instead of `token`
   - Exchanges recovery code for session: `supabase.auth.exchangeCodeForSession(code)`
   - Updates password using Supabase Auth: `supabase.auth.admin.updateUserById()`
   - Removed bcrypt hashing (handled by Supabase)

### Frontend Files
1. **[src/app/forgot-password/page.tsx](src/app/forgot-password/page.tsx)**
   - No changes needed (already compatible)
   - Displays success message after email is sent

2. **[src/app/reset-password/page.tsx](src/app/reset-password/page.tsx)**
   - Updated to use `code` query parameter (from Supabase)
   - Improved error handling for expired/invalid codes
   - Better UX with specific error messages

### Utility Files
1. **[src/lib/supabaseClient.ts](src/lib/supabaseClient.ts)**
   - NEW: Browser-side Supabase client for frontend usage
   - Uses `createBrowserClient` for client-side authentication

## Environment Variables

Your `.env` file already contains the necessary Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rhmiswzyecnmcwcvkijg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://rhmiswzyecnmcwcvkijg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FRONTEND_URL=http://localhost:3000  # Used in backend for redirect URLs
```

## Supabase Configuration

### Redirect URLs Already Configured
Your Supabase project already has these redirect URLs configured:
- `https://samcard.vercel.com`
- `https://samcard.vercel.com/reset-password` ✓ (This is the one used for password resets)
- `http://localhost:3000`

The reset password recovery link will redirect to: 
`https://samcard.vercel.com/reset-password?code=ABC123...`

### Custom Email Template (Optional)
If you want to customize the password reset email in Supabase:
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Edit the "Reset Password" template
3. Customize the email design/text
4. The default recovery link is provided as `{{ .ConfirmationURL }}`

## Testing the Integration

### Local Testing
1. Start your backend: `npm run dev` (in backend directory)
2. Start your frontend: `npm run dev` (in root directory)
3. Go to `http://localhost:3000/forgot-password`
4. Enter a test email address (must be registered in your Supabase Auth)
5. Check email (Supabase sends from `noreply@{project}.supabase.co` by default)
6. Click the recovery link
7. You'll be redirected to `http://localhost:3000/reset-password?code=...`
8. Enter new password and confirm
9. After successful reset, you'll be redirected to `/login`

### Production Testing
1. Go to `https://samcard.vercel.com/forgot-password`
2. Enter your email
3. Check your email for reset link
4. The link will redirect to `https://samcard.vercel.com/reset-password?code=...`
5. Reset your password

## API Endpoints

### POST /api/auth/forgot-password
**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "If an account with that email exists, you will receive a password reset link shortly."
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Email is required"
}
```

### POST /api/auth/reset-password
**Request:**
```json
{
  "code": "recovery_code_from_email_link",
  "newPassword": "newsecurepassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now log in."
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid or expired reset link"
}
```

## Security Features

✅ **Built-in Supabase Security:**
- Tokens expire after 1 hour by default
- Recovery codes are one-time use
- Supabase handles token generation securely
- No passwords stored in your database

✅ **Backend Security:**
- Service role key used for server-side operations
- User enumeration protection (always returns success message)
- Password validation (minimum 8 characters)
- Secure token exchange before password update

✅ **Frontend Security:**
- Password confirmation validation
- Clear error messages for invalid/expired links
- HTTPS in production
- Protected routes with Supabase Auth

## Database Changes (Optional)

The custom `EmailToken` table is **no longer needed** if you're fully migrated to Supabase Auth. However, you can keep it for backward compatibility.

If you want to remove it:
```sql
DROP TABLE IF EXISTS EmailToken;
```

## Troubleshooting

### "Invalid or missing reset code"
- Recovery link may have expired (expires after 1 hour)
- User must request a new reset link from forgot-password page

### Recovery email not arriving
- Check spam/junk folder
- Verify email address is registered in Supabase Auth
- Check Supabase email settings (Auth → Settings → Email)

### Password update fails
- Ensure password is at least 8 characters
- Verify recovery code hasn't been used before
- Check backend logs for detailed errors

### Wrong redirect URL
- Verify redirect URL is in Supabase Auth Settings
- Check `FRONTEND_URL` env variable
- Ensure `frontend_url` parameter in `resetPasswordForEmail()` is correct

## Next Steps

1. **Test the flow** locally and in production
2. **Monitor logs** for any errors during password resets
3. **Customize email template** in Supabase if desired
4. **Deprecate old system** - Remove custom `EmailToken` table usage when ready
5. **Update user documentation** if password reset process changed for users

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Password Reset Guide](https://supabase.com/docs/guides/auth/auth-password-reset)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-smtp#email-templates)
