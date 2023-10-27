import { CommentsService } from "../services/comments.service.js";

export class CommentsController {
  static async getAllComments(req, res, next) {
    try {
      const comments = await CommentsService.getAllComments();
      return res.status(200).send(comments);
    } catch (error) {
      next(error);
    }
  }
  static async createComment(req, res, next) {
    try {
      //   1. get the user from the guard
      const user = req.user;
      //   2. get the commentData from the body
      const commentData = req.body;
      //   3. create the comment according to the logic
      const createdComment = await CommentsService.createComment(user, commentData);

      return res.status(201).send({
        message: "Comment Added Successfully",
        comment: createdComment,
      });
    } catch (error) {
      next(error);
    }
  }
}
