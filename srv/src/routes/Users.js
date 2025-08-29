import { Router } from "express";
import { UserController } from "../controllers/UserController.js";

const UserHandler = Router();

UserHandler.post('/create', UserController.register);
UserHandler.post('/login', UserController.login);
UserHandler.post('/auth', UserController.authenticate);
UserHandler.post('/forgot', UserController.forgot);
UserHandler.post("/reset-password", UserController.resetPassword);

export default UserHandler;