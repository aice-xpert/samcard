# Fixed Supabase Auth Integration - Testing Guide

## ✅ Issues Fixed

1. **Backend Error**: `resetPasswordForEmail` doesn't exist on `GoTrueAdminApi`
   - **Solution**: Changed to use `supabase.auth.admin.generateLink()` instead
   - **File**: [backend/auth/forgot-password.ts](backend/auth/forgot-password.ts)

2. **Recovery Code Handling**: Updated to properly verify recovery tokens
   - **Solution**: Use `supabase.auth.verifyOtp()` with recovery type
   - **File**: [backend/auth/reset-password.ts](backend/auth/reset-password.ts)

3. **Email Required**: Backend now requires email for OTP verification
   - **Solution**: Added email input field to reset-password form
   - **File**: [src/app/reset-password/page.tsx](src/app/reset-password/page.tsx)

## Updated API Endpoints

### POST /api/auth/forgot-password
**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If an account with that email exists, you will receive a password reset link shortly."
}
```

### POST /api/auth/reset-password
**Request:**
```json
{
  "code": "recovery_code_from_email",
  "email": "user@example.com",
  "newPassword": "newsecurepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now log in."
}
```

## Testing Instructions

### Step 1: Start Backend
```bash
cd backend
npm run dev
```

### Step 2: Start Frontend
```bash
npm run dev
```

### Step 3: Test Forgot Password
1. Go to `http://localhost:3000/forgot-password`
2. Enter an email address (must be registered in Supabase Auth)
3. You should see: "Check your inbox!"
4. Check your email for the recovery link from Supabase
5. The link should look like: `http://localhost:3000/reset-password#type=recovery&code=XXX`

### Step 4: Test Reset Password
1. Click the recovery link from email
2. You'll be redirected to `/reset-password` with the code in URL hash
3. Page should display:
   - Email address input field
   - New Password input field
   - Confirm Password input field
4. Enter your email and new password (min 8 characters)
5. Click "Reset Password"
6. You should see: "Password updated!"
7. After 3 seconds, you'll be redirected to login
8. Login with your new password

## Production Testing

### For Production: https://samcard.vercel.com

1. Go to `https://samcard.vercel.com/forgot-password`
2. Enter your email
3. Wait for recovery email
4. Click the link in email
5. Reset your password
6. Login with new password

## Environment Variables (Already Configured)

```env
SUPABASE_URL=https://rhmiswzyecnmcwcvkijg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SUPABASE_URL=https://rhmiswzyecnmcwcvkijg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
FRONTEND_URL=http://localhost:3000
```

## Troubleshooting

### "Property 'verifyOtp' does not exist" Error
- Update Supabase JS SDK to latest version
- Run: `npm install @supabase/supabase-js@latest` in backend

### Recovery email not arriving
- Check spam/junk folder
- Verify email is registered in Supabase Auth
- In Supabase Dashboard → Authentication → Settings → Email
- Ensure SMTP is configured if using custom email

### Invalid or expired recovery link
- Recovery links expire after 1 hour by default
- User must request a new one from forgot-password page

### Backend compilation fails
- Ensure all Supabase JS SDK types are up to date
- Run: `npm install` in backend directory
- Check TypeScript version compatibility

## Files Modified

1. ✅ [backend/auth/forgot-password.ts](backend/auth/forgot-password.ts)
   - Uses `admin.generateLink()` instead of `resetPasswordForEmail()`
   - Removed custom email sending

2. ✅ [backend/auth/reset-password.ts](backend/auth/reset-password.ts)
   - Uses `verifyOtp()` for recovery token verification
   - Updated to accept `email` parameter
   - Uses `admin.updateUserById()` to update password

3. ✅ [src/app/reset-password/page.tsx](src/app/reset-password/page.tsx)
   - Added email input field
   - Handles both query params and URL hash for recovery code
   - Sends email with reset request

4. ✅ [src/lib/supabaseClient.ts](src/lib/supabaseClient.ts)
   - Created browser-side Supabase client

## Next Steps

1. **Test locally** with a test Supabase account
2. **Verify email delivery** from Supabase
3. **Monitor logs** for any errors
4. **Test in production** when ready
5. **Customize email** template in Supabase if desired

## Resources

- [Supabase Admin API Docs](https://supabase.com/docs/reference/javascript/admin-api)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Password Reset Guide](https://supabase.com/docs/guides/auth/auth-password-reset)
