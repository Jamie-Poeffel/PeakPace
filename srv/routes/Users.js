import { Router } from "express";
import { UserController } from "../controllers/UserController.js";

const UserHandler = Router();

UserHandler.post('/create', UserController.create)

export default UserHandler;