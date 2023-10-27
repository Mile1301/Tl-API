import { Router } from "express";
import { UsersController } from "../controllers/user.controller.js";

export const usersRouter = Router();

usersRouter.get("/posts", UsersController.getPostsByUser);
usersRouter.get("/comments", UsersController.getCommentsByUser);
