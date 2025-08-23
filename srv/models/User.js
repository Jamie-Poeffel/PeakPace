import db from "../config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export class User {
    constructor({ id = null, identifier, password, age, session = null }) {
        this.id = id;
        this.identifier = identifier;
        this.password = password;
        this.age = age;
        this.session = session;
    }

    static async hashPassword(password) {
        return bcrypt.hash(password, 12); // higher cost factor for safety
    }

    async validatePassword(password) {
        return bcrypt.compare(password, this.password);
    }

    static async checkSession(id, key) {
        const doc = await db.collection("users").doc(id).get();
        if (!doc.exists) {
            return { error: "User not found" };
        }

        const data = doc.data();
        if (!data.session || data.session.key !== key) {
            return { error: "Session is invalid, please login again" };
        }

        return { message: "Session is valid" };
    }

    static async authenticate(identifier, password) {
        const snapshot = await db
            .collection("users")
            .where("identifier", "==", identifier)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return { error: "Email or password incorrect" };
        }

        const doc = snapshot.docs[0];
        const userData = doc.data();

        const isValid = await bcrypt.compare(password, userData.password);
        if (!isValid) {
            return { error: "Email or password incorrect" };
        }

        const session = {
            key: crypto.randomBytes(32).toString("hex"),
            createdAt: new Date(),
        };

        await db.collection("users").doc(doc.id).set(
            { session },
            { merge: true }
        );

        return {
            message: "Authentication successful",
            session: { userId: doc.id, ...session },
        };
    }

    async save() {
        if (!this.identifier) {
            throw new Error("User identifier is required");
        }

        if (this.password && !this.password.startsWith("$2b$")) {
            this.password = await User.hashPassword(this.password);
        }

        const dataToSave = {
            identifier: this.identifier,
            password: this.password,
            age: this.age,
        };

        if (this.id) {
            await db.collection("users").doc(this.id).set(dataToSave, { merge: true });
        } else {
            // Use identifier as docId for uniqueness
            const userRef = db.collection("users").doc(this.identifier);
            await userRef.set(dataToSave, { merge: false });
            this.id = userRef.id;
        }

        return this;
    }

    static async findById(id) {
        const doc = await db.collection("users").doc(id).get();
        if (!doc.exists) return null;
        return new User({ id: doc.id, ...doc.data() });
    }
}
