import db from "../config/db.js";
import bcrypt from 'bcrypt'

export class User {
    constructor({ identifier, password, age, id = null }) {
        this.id = id;
        this.identifier = identifier;
        this.password = password;
        this.age = age;
    }

    static async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async validatePassword(password) {
        return await bcrypt.compare(password, this.password);
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
        };

        if (this.age !== undefined) dataToSave.age = this.age;

        if (this.id) {
            const userRef = db.collection("users").doc(this.id);
            await userRef.set(dataToSave, { merge: true, ignoreUndefinedProperties: true });
        } else {
            const snapshot = await db
                .collection("users")
                .where("identifier", "==", this.identifier)
                .get();

            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                this.id = doc.id;
                const userRef = db.collection("users").doc(this.id);
                await userRef.set(dataToSave, { merge: true, ignoreUndefinedProperties: true });
            } else {
                const userRef = await db.collection("users").add(dataToSave);
                this.id = userRef.id;
            }
        }

        return this;
    }
}