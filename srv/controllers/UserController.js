import { User } from "../models/User.js";

export class UserController {
    static async create(req, res) {
        const { identifier, password, age } = req.body;

        const user = await new User({ identifier, password, age }).save();

        return res.status(201).json(user);
    }
}