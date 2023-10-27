import { PostService } from "../services/posts.service.js";

export class PostsController {
  static async getAllPosts(req, res, next) {
    try {
      const posts = await PostService.getAllPosts();
      return res.json(posts);
    } catch (error) {
      return next(error);
    }
  }
  static async createPost(req, res, next) {
    try {
      const user = req.user;
      const postData = req.body;

      const newPost = await PostService.createPost(user, postData);

      return res.json(newPost);
    } catch (error) {
      return next(error);
    }
  }
  static async getPostById(req, res, next) {
    try {
      const postId = req.params.id;
      const foundPost = await PostService.getPostById(postId);
      return res.json(foundPost);
    } catch (error) {
      return next(error);
    }
  }
  static async updatePost(req, res, next) {
    try {
      const postId = req.params.id;
      const updateData = req.body;
      const user = req.user;

      await PostService.updatePost(user, postId, updateData);

      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }
  static async deletePost(req, res, next) {
    try {
      const postId = req.params.id;

      await PostService.deletePost(postId);
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }
  static async likePost(req, res, next) {
    try {
      const postId = req.params.id;
      const likeCount = await PostService.likePost(postId);

      return res.status(200).json(likeCount);
    } catch (error) {
      return next(error);
    }
  }
  static async dislikePost(req, res, next) {
    try {
      const postId = req.params.id;
      const dislikeCount = await PostService.dislikePost(postId);

      return res.status(200).json(dislikeCount);
    } catch (error) {
      return next(error);
    }
  }
}
