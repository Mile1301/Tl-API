import { verifyAccessToken } from "../const/jwt.const.js";
import { User } from "../models/user.model.js";

// This auth middleware is used to take the data from the logged user (if any) and check for current logged user. it is passed to the main feature (posts) or any other according to the business logic of the app to act as a Guard
export const authValidator = async (req, res, next) => {
  try {
    // 1.gets the Bearer token from the authorization header (the Bearer token is passed from the loginUser function)
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return res.sendStatus(403);

    // 2.gets the token by splitting the Bearer token form the authorization header on the space between and takes the second string
    // console.log(req.headers);
    const token = authorizationHeader.split(" ")[1];
    if (!token) return res.sendStatus(403);

    // 3.passes the token on the verifyAccessToken function to take the userId from the token's payload
    const { userId } = verifyAccessToken(token);
    // console.log("user id is: ", userId);

    // 4. gets the found user by it in the MongoDB using mongoose syntax
    const foundUser = await User.findById(userId);
    if (!foundUser) return res.sendStatus(403);
    // console.log("The user is: ", foundUser);

    // 5.sets the user object on the request object for further use
    req.user = foundUser;
    // console.log(req);

    // 6. if all tests are passed the middleware continues on the next one, if not i returns 403 Forbidden for each false test
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(403);
  }
};
