import { createAccessToken, createRefreshToken } from "../const/jwt.const.js";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  static async registerUser(req, res, next) {
    try {
      const userData = req.body;
      await AuthService.registerUser(userData);
      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await AuthService.loginUser(email, password);
      // Since the user object is passed from the db extract the user._id to  pass it further for token creation
      //   1. creating the access token with the user's id got from the logged user
      const accessToken = createAccessToken(user._id);
      //   2. setting the access-token header on the logged user's response object
      res.set("access-token", accessToken);
      //   3. creating the access token with the user's id got from the logged user
      const refreshToken = createRefreshToken(user._id);
      //   4. setting the refresh-token header on the logged user's response object
      res.set("refresh-token", refreshToken);

      //   5. setting the access-control-expose-headers object which values are the tokens headers (access and refresh)
      // This is needed to allow browser-side javascript to be able to read the custom headers
      res.set("access-control-expose-headers", "access-token, refresh-token");
      //   6. save the refreshToken in the users refreshToken property array
      await AuthService.saveRefreshToken(user, refreshToken);
      return res.json(user);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async refreshAccessToken(req, res, next) {
    try {
      // After the user is logged
      // 1. trying to read the refreshToken in the request header passed from the logged user's response header
      const refreshToken = req.headers["refresh-token"];
      if (!refreshToken) throw new Error("Unauthorized");
      // 2. get the user by calling the validateRefreshToken method from authService and pass the refreshToken as an argument
      const foundUser = await AuthService.validateRefreshToken(refreshToken);
      //   * Optional - for making persistant infinite login the current refreshToken is deleted and a new one is created on each pinging the refresh tokens endpoint
      //   * 6 delete the current refreshToken passed from the logged user's response header
      await AuthService.deleteRefreshToken(foundUser, refreshToken);
      // 3. after succesfully finding the user, new access token is being generated
      const accessToken = createAccessToken(foundUser._id);
      //   * 7 generate new refreshToken
      const newRefreshToken = createRefreshToken(foundUser._id);
      //   * 8 save the new refreshToken in the users refreshToken property array
      await AuthService.saveRefreshToken(foundUser, newRefreshToken);
      // 4. setting the access-token header on the logged user's response object
      res.set("access-token", accessToken);
      //   * 8 setting the refresh-token header on the logged user's response object
      res.set("refresh-token", newRefreshToken);
      // 5. setting the access-control-expose-headers object which values are the tokens headers (access and refresh)
      res.set("access-control-expose-headers", "access-token, refresh-token");

      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async logoutUser(req, res, next) {
    try {
      //   1. get the user from the request object
      const user = req.user;

      //   2. read the refreshToken passd in the request header from the logged user's response header
      const refreshToken = req.headers["refresh-token"];

      //   3. call the deleteToken function from the service
      await AuthService.deleteRefreshToken(user, refreshToken);
      //   4. if everything is ok return OK no content
      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async logoutAllUsers(req, res, next) {
    try {
      //   1. get the user from the request object
      const user = req.user;

      //   2. call the deleteToken function from the service
      await AuthService.deleteAllRefreshTokens(user);

      //   3. if everything is ok return OK no content
      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
