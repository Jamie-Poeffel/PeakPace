import { Router } from "express";
import UserHandler from "./Users.js";

const handler = Router();

handler.use('/users', UserHandler)

export default handler;