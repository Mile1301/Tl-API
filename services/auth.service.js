import { BadRequest, Forbidden, Unauthorized } from "../const/error.const.js";
import { verifyRefreshToken } from "../const/jwt.const.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
export class AuthService {
  // 1. register user
  static async registerUser(userData) {
    try {
      const user = await User(userData);
      await user.save();
    } catch (error) {
      console.log(error);
      throw new BadRequest(`Couldn't register user, ERROR: ${error.message}`);
    }
  }
  //   2. login user
  static async loginUser(email, password) {
    try {
      const user = await User.findOne({ email });

      if (!user) throw "Invalid credentials";

      const isPassportValid = await bcrypt.compare(password, user.password);

      if (!isPassportValid) throw "Invalid credentials";

      return user;
    } catch (error) {
      throw new Unauthorized(error);
    }
  }
  //   3. validate the refresh token
  static async validateRefreshToken(refreshToken) {
    try {
      // 1.passing the token on the verifyRefreshToken function to take the userId from the token's payload
      const { userId } = verifyRefreshToken(refreshToken);

      // 2. gets the found user by it in the MongoDB using mongoose syntax
      const foundUser = await User.findById(userId);
      if (!foundUser) throw new Forbidden();

      //   3. search for the refresh token in the user's refreshToken array property
      if (!foundUser.refreshTokens.find((token) => token === refreshToken)) throw new Forbidden();

      //   4. if all test are ok, return the found user for further use
      return foundUser;
    } catch (error) {
      throw error;
    }
  }
  //   4. save the refresh token on the user object refreshToken property array
  static async saveRefreshToken(user, refreshToken) {
    try {
      user.refreshTokens.push(refreshToken);
      await user.save();
    } catch (error) {
      throw error;
    }
  }
  //   5. delete refresh token
  static async deleteRefreshToken(user, refreshToken) {
    try {
      // 1. filter the refreshTokens array by comparing the passed token with all tokens in the array and returning the other tokens that don't match the given one
      user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);

      //   2. save the user
      await user.save();
    } catch (error) {
      throw error;
    }
  }
  //   6. delete all refresh tokens
  static async deleteAllRefreshTokens(user) {
    try {
      // 1. clear the refreshTokens arrray by assigning  empty array to the property
      user.refreshTokens = [];
      //   2. save the user
      await user.save();
    } catch (error) {
      throw error;
    }
  }
}
