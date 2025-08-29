// repositories/UserRepository.js
import db from "../config/db.js";
import { User } from "../models/User.js";

export class UserRepository {
    static async save(user) {
        const dataToSave = {
            identifier: user.identifier,
            password: user.password,
            age: user.age,
            email: user.email,
            session: user.session,
        };

        if (user.id) {
            await db.collection("users").doc(user.id).set(dataToSave, { merge: true });
        } else {
            const userRef = db.collection("users").doc(user.identifier);
            await userRef.set(dataToSave);
            user.id = userRef.id;
        }

        return user;
    }

    static async findById(id) {
        const doc = await db.collection("users").doc(id).get();
        if (!doc.exists) return null;
        return new User({ id: doc.id, ...doc.data() });
    }

    static async findByIdentifier(identifier) {
        const snapshot = await db.collection("users")
            .where("identifier", "==", identifier)
            .limit(1)
            .get();

        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return new User({ id: doc.id, ...doc.data() });
    }

    static async saveResetToken(userId, token, expiresAt) {
        await db.collection("users").doc(userId).set(
            {
                resetPassword: {
                    token,
                    expiresAt
                }
            },
            { merge: true }
        );
    }

    static async getResetTokenData(userId) {
        const doc = await db.collection("users").doc(userId).get();
        if (!doc.exists) return null;
        const data = doc.data();
        return data.resetPassword || null;
    }

    static async updatePassword(userId, hashedPassword) {
        await db.collection("users").doc(userId).set(
            {
                password: hashedPassword,
                resetPassword: null
            },
            { merge: true }
        );
    }
}
