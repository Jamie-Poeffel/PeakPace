// utils/mailer.js
import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendPasswordResetEmail(to, resetLink) {
    await transporter.sendMail({
        from: `"PeakPace Support" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Reset your password",
        html: `
            <p>Hello,</p>
            <p>You requested to reset your password.</p>
            <p>Click the link below to reset it (valid for 10 minutes):</p>
            <p><a style={color: #4f39f6} href="${resetLink}">${resetLink}</a></p>
            <p>If you did not request this, you can safely ignore this email.</p>
        `,
    });
}
