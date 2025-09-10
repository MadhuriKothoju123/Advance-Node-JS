import { transporter } from "../config/emailConfig";

type ResetPayload = {
  email: string;
  fullName?: string | null;
  resetLink: string;
};

export async function sendPasswordResetEmail(payload: ResetPayload) {
  const { email, fullName, resetLink } = payload;

  const from = process.env.MAIL_FROM || `"HR Team" <${process.env.SMTP_USER}>`;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Set your password",
    html: `
      <p>Hello ${fullName ?? "there"},</p>
      <p>Your account has been created. Please set your password using the link below (valid for a limited time):</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>If you didn’t expect this email, you can ignore it.</p>
    `
  });

  console.log(`[email-service] Password reset email sent to ${email}`);
}
