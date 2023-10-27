import { Router } from "express";
import { CommentsController } from "../controllers/comment.controller.js";
import { commentSchema, entityValidator } from "../middlewares/entity-validator.middleware.js";

export const commentsRouter = Router();

// 1. GET all comments
commentsRouter.get("/", CommentsController.getAllComments);
// 2. POST a comment
commentsRouter.post("/", entityValidator(commentSchema), CommentsController.createComment);
