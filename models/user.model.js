import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 30,
  },

  email: {
    type: String,
    required: true,
    // Make emails unique in database
    unique: true,
    // Add email validation
    validate: {
      validator: (value) => validator.isEmail(value),
      message: () => "Invalid Email syntax",
    },
  },
  // password validation works for plain text password values
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  refreshTokens: [
    {
      type: String,
    },
  ],
});
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password") || user.isNew) {
    const hashedPassword = await bcrypt.hash(user.password, 8);
    user.password = hashedPassword;
  }
  return next();
});

// Catch unique email error and return readable error text
userSchema.post("save", (error, _doc, next) => {
  console.log("The post error is", error);
  if (error.code === 11000) {
    return next({ message: "Email already in use" });
  }
  return next();
});

// Delete password and refresh tokens before sending user to client
userSchema.set("toJSON", {
  transform: function (_doc, ret, _opt) {
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);
