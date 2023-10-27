import { PostsController } from "../controllers/posts.controller.js";

import { Router } from "express";
import { entityValidator, postSchema, updatePostSchema } from "../middlewares/entity-validator.middleware.js";

export const postsRouter = Router();

// 1. GET all posts
postsRouter.get("/", PostsController.getAllPosts);
// 2. POST new post
postsRouter.post("/", entityValidator(postSchema), PostsController.createPost);
// 3. GET post by id
postsRouter.get("/:id", PostsController.getPostById);
// 4. PUT post by id
postsRouter.put("/:id", entityValidator(updatePostSchema), PostsController.updatePost);
// 5. DELETE post by id
postsRouter.delete("/:id", PostsController.deletePost);
// 6. PATCH Like post
postsRouter.patch("/:id/like", PostsController.likePost);
// 7. PATCH Dislike post
postsRouter.patch("/:id/dislike", PostsController.dislikePost);
