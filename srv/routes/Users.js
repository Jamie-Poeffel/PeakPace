import { Router } from "express";
import { UserController } from "../controllers/UserController.js";

const UserHandler = Router();

UserHandler.post('/create', UserController.create);
UserHandler.post('/login', UserController.login);
UserHandler.post('/auth', UserController.authenticate)

export default UserHandler;