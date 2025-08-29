// services/UserService.js
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { User } from "../models/User.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { config } from "dotenv";
config()

export class UserService {
    static async register({ identifier, email, password, age }) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ identifier, password: hashedPassword, age, email });
        return UserRepository.save(user);
    }

    static async authenticate(identifier, password) {
        const user = await UserRepository.findByIdentifier(identifier);
        if (!user) return { error: "Email or password incorrect" };

        const isValid = await user.validatePassword(password, bcrypt);
        if (!isValid) return { error: "Email or password incorrect" };

        const session = {
            key: crypto.randomBytes(32).toString("hex"),
            createdAt: new Date(),
        };
        user.session = session;

        await UserRepository.save(user);

        return {
            message: "Authentication successful",
            session: { userId: user.id, ...session },
            user: user.toViewModel(),
        };
    }

    static async checkSession(userId, key) {
        const user = await UserRepository.findById(userId);
        if (!user || !user.session || user.session.key !== key) {
            return { error: "Session is invalid, please login again" };
        }
        return { message: "Session is valid" };
    }

    static async requestPasswordReset(identifier) {
        const user = await UserRepository.findByIdentifier(identifier);
        if (!user) return { error: "User not found" };

        const token = crypto.randomBytes(20).toString("hex");
        const expiresAt = Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000));
        const frontend = process.env.FRONTEND

        await UserRepository.saveResetToken(user.id, token, expiresAt);

        const resetLink = `http://${frontend}/reset-password?token=${token}&id=${user.id}`;

        await sendPasswordResetEmail(user.email, resetLink);

        return {
            message: "Password reset instructions have been sent to your email",
        };
    }

    static async resetPassword({ id, token, newPassword }) {
        const resetData = await UserRepository.getResetTokenData(id);
        if (!resetData) {
            return { error: "Invalid or expired reset request" };
        }

        if (resetData.token !== token) {
            return { error: "Invalid reset token" };
        }

        if (new Date() > resetData.expiresAt.toDate?.() || new Date() > resetData.expiresAt) {
            return { error: "Reset token has expired" };
        }

        const hashed = await bcrypt.hash(newPassword, 12);
        await UserRepository.updatePassword(id, hashed);

        return { message: "Password reset successful" };
    }
}
