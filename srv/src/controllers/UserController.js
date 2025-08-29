import { UserService } from "../services/UserService.js";

export class UserController {
    static async register(req, res) {
        try {
            const { identifier, password, age, email } = req.body || {};

            if (!identifier || typeof identifier !== "string") {
                return res.status(400).json({ error: "Identifier is required and must be a string" });
            }

            if (!password || typeof password !== "string" || password.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters" });
            }

            if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
                return res.status(400).json({ error: "A valid email is required" });
            }

            if (age !== undefined && (typeof age !== "number" || age <= 0)) {
                return res.status(400).json({ error: "Age must be a positive number if provided" });
            }

            const user = await UserService.register({ identifier, password, age, email });
            res.json(user.toViewModel());
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }


    static async login(req, res) {
        try {
            const { identifier, password } = req.body || {};
            if (!identifier || !password) {
                return res.status(400).json({ error: "Identifier and password are required" });
            }

            const result = await UserService.authenticate(identifier, password);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async authenticate(req, res) {
        try {
            const { id, key } = req.body || {};
            if (!id || !key) {
                return res.status(400).json({ error: "Session id and key are required" });
            }

            const r = await UserService.checkSession(id, key);
            res.send(r);
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async forgot(req, res) {
        try {
            const { identifier } = req.body || {};
            if (!identifier) {
                return res.status(400).json({ error: "identifier is required" });
            }

            const r = await UserService.requestPasswordReset(identifier);
            res.send(r);
        } catch (err) {
            res.status(500).json({ error: "Internal server error" + err });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { id, token, newPassword } = req.body || {};
            if (!id || !token || !newPassword) {
                return res.status(400).json({ error: "id, token and newPassword are required" });
            }

            const r = await UserService.resetPassword({ id, token, newPassword });
            res.send(r);
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
