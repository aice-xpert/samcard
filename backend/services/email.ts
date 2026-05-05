import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM || "SamCard <noreply@samcard.app>";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const verifyUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Verify your SamCard email address",
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family:sans-serif;background:#f4f4f4;margin:0;padding:0;">
          <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;">
            <div style="background:#008001;padding:32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;">SamCard</h1>
            </div>
            <div style="padding:32px;">
              <h2 style="color:#111111;margin-top:0;">Verify your email</h2>
              <p style="color:#444444;line-height:1.6;">Hi ${name},</p>
              <p style="color:#444444;line-height:1.6;">Click the button below to verify your email address. This link expires in 24 hours.</p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${verifyUrl}" style="background:#008001;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:16px;">Verify Email</a>
              </div>
              <p style="color:#888888;font-size:13px;">Or paste this link: <a href="${verifyUrl}" style="color:#008001;">${verifyUrl}</a></p>
              <p style="color:#888888;font-size:13px;">If you didn't create a SamCard account, you can ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Reset your SamCard password",
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family:sans-serif;background:#f4f4f4;margin:0;padding:0;">
          <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;">
            <div style="background:#008001;padding:32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;">SamCard</h1>
            </div>
            <div style="padding:32px;">
              <h2 style="color:#111111;margin-top:0;">Reset your password</h2>
              <p style="color:#444444;line-height:1.6;">Hi ${name},</p>
              <p style="color:#444444;line-height:1.6;">Click the button below to reset your password. This link expires in 1 hour.</p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${resetUrl}" style="background:#008001;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:16px;">Reset Password</a>
              </div>
              <p style="color:#888888;font-size:13px;">Or paste this link: <a href="${resetUrl}" style="color:#008001;">${resetUrl}</a></p>
              <p style="color:#888888;font-size:13px;">If you didn't request a password reset, you can ignore this email. Your password won't change.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
