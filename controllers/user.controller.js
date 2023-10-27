import { UsersService } from "../services/users.service.js";

export class UsersController {
  static async getPostsByUser(req, res, next) {
    try {
      // 1. get the user from the guard
      const user = req.user;
      // 2. execute the service function to populate the all user's posts
      const posts = await UsersService.getPostsByUser(user);
      // 3. return the posts
      return res.json(posts);
    } catch (error) {
      next(error);
    }
  }
  static async getCommentsByUser(req, res, next) {
    try {
      // 1. get the user from the guard
      const user = req.user;
      // 2. execute the service function to populate the all user's comments
      const comments = await UsersService.getCommentsByUser(user);
      // 3. return the comments
      return res.json(comments);
    } catch (error) {
      next(error);
    }
  }
}
