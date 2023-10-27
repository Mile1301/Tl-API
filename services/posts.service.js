import { NotFound, GeneralError, BadRequest } from "../const/error.const.js";
import { Post } from "../models/posts.model.js";

export class PostService {
  // 1.get all posts
  static async getAllPosts() {
    try {
      const posts = await Post.find({}).populate("author");
      return posts;
    } catch (error) {
      throw new GeneralError(`Couldn't fetch posts, ERROR: ${error}`);
    }
  }
  //   2.add a post
  static async createPost(user, postData) {
    try {
      const { title, body } = postData;

      const newPost = new Post({ title, body, author: user._id });

      const createdPost = await newPost.save();

      user.posts.push(createdPost._id);

      await user.save();

      return createdPost;
    } catch (error) {
      throw new GeneralError(`Couldn't create posts, ERROR: ${error}`);
    }
  }
  //   3. get post by id
  static async getPostById(postId) {
    try {
      const foundPost = await Post.findById(postId)
        .populate({
          path: "author",
          select: "username email",
        })
        .populate({
          path: "comments",
          populate: {
            path: "author",
            select: "username",
          },
        });
      if (!foundPost) throw new NotFound("Post not found");

      return foundPost;
    } catch (error) {
      throw new NotFound(`Couldn't fetch posts, ERROR: ${error}`);
    }
  }
  //   4. update a post
  static async updatePost(user, postId, updateData) {
    try {
      // const foundPost = await this.getPostById(postId);

      const foundPost = await Post.findOne({ _id: postId, author: user._id });
      if (!foundPost) throw new NotFound("Post not found");
      Object.assign(foundPost, updateData);

      await foundPost.save();
    } catch (error) {
      throw new GeneralError(`Couldn't update posts, ERROR: ${error}`);
    }
  }
  //   5. delete post
  static async deletePost(user, postId) {
    try {
      const deletedPost = await Post.findOneAndDelete({ _id: postId, author: user._id });

      if (!deletedPost) throw new NotFound("Post not found");
    } catch (error) {
      throw new NotFound(`Post not found, ERROR: ${error}`);
    }
  }
  // 6. like a post
  static async likePost(postId) {
    try {
      const foundPost = await this.getPostById(postId);
      foundPost.likes += 1;
      const updatedPost = await foundPost.save();

      return { likes: updatedPost.likes };
    } catch (error) {
      throw new BadRequest(`Couldn't like post, ERROR: ${error}`);
    }
  }
  // 7. like a post
  static async dislikePost(postId) {
    try {
      const foundPost = await this.getPostById(postId);
      foundPost.dislikes += 1;
      const updatedPost = await foundPost.save();

      return { dislikes: updatedPost.dislikes };
    } catch (error) {
      throw new BadRequest(`Couldn't dislike post, ERROR: ${error}`);
    }
  }
}
