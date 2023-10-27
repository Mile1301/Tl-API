import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authValidator } from "../middlewares/auth.middleware.js";
import { entityValidator, userSchema } from "../middlewares/entity-validator.middleware.js";

export const authRouter = Router();

// 1. POST register user
authRouter.post("/register", entityValidator(userSchema), AuthController.registerUser);
// 2. POST login user
authRouter.post("/login", AuthController.loginUser);
// 3. POST refresh-token
authRouter.post("/refresh-token", AuthController.refreshAccessToken);
// 4. POST logout
authRouter.post("/logout", authValidator, AuthController.logoutUser);
// 5. POST logout-all
authRouter.post("/logout-all", authValidator, AuthController.logoutAllUsers);
