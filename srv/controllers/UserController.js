import { User } from "../models/User.js";

export class UserController {
    static async create(req, res) {
        const { identifier, password, age } = req.body;

        const user = await new User({ identifier, password, age }).save();

        return res.status(201).json(user);
    }

    static async login(req, res) {
        const { identifier, password } = req.body;

        const r = await User.authenticate(identifier, password);

        return res.send(r);
    }

    static async authenticate(req, res) {
        const { id, key } = req.body;

        const r = await User.checkSession(id, key);

        return res.send(r)
    }
}