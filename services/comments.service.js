import { BadRequest } from "../const/error.const.js";
import { Comment } from "../models/comment.model.js";
import { PostService } from "../services/posts.service.js";
export class CommentsService {
  // 1. get all comments
  static async getAllComments() {
    try {
      const comments = await Comment.find({}).sort({
        createdAt: "desc",
      });
      return comments;
    } catch (error) {
      throw new GeneralError(`Couldn't fetch comments, ERROR:${error}`);
    }
  }
  //   2. post a comment
  static async createComment(user, commentData) {
    try {
      //   1. find the post by using the getPOstById srvice function and the argument is the passed comment data.post which in this case is actually the postId
      const post = await PostService.getPostById(commentData.post);
      //   2. create the comment according to it's model but we pass separatelly the user which must be it's author and the data (title and body)
      const comment = new Comment({ ...commentData, author: user._id });
      //   3. saving the comment in db
      const createdComment = await comment.save();
      //   4. according to the logic push the comment in the post object and in the user object(because the user is it's author)
      post.comments.push(createdComment._id);
      user.comments.push(createdComment._id);
      //   5. save the updated post and user objects in db
      await post.save();
      await user.save();
      //   6. return the created comment
      return createdComment;
    } catch (error) {
      throw new BadRequest(`Couldn't create comment, ERROR: ${error}`);
    }
  }
}
