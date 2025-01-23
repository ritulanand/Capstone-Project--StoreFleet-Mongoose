import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user name is requires"],
    maxLength: [30, "user name can't exceed 30 characters"],
    minLength: [2, "name should have atleast 2 charcters"],
  },
  email: {
    type: String,
    required: [true, "user email is requires"],
    unique: true,
    validate: [validator.isEmail, "pls enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    select: false,// please explain this
  },
  profileImg: {
    public_id: {
      type: String,
      required: true,
      default: "1234567890",
    },
    url: {
      type: String,
      required: true,
      default: "this is dummy avatar url",
    },
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  //  hash user password before saving using bcrypt
  try {
    const user = this;
    console.log("user", user);
    console.log("this.isModifiedpassword", this.isModified("password"));
    if (!this.isModified("password")) { // please explain user.isModified
      console.log("this ismodig=fied", this.isModified(this.password));
      return next();
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
    console.log("user hashed pass", user.password);
    next();
  } catch (error) {
    next(error);
  }
});

// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_Secret, {
    expiresIn: process.env.JWT_Expire,
  });
};
// user password compare
userSchema.methods.comparePassword = async function (password) {
  console.log("copare", password);
  return await bcrypt.compare(password, this.password);
};

// generatePasswordResetToken
userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = await crypto.randomBytes(20).toString("hex");

  // hashing and updating user resetPasswordToken
  this.resetPasswordToken = resetToken;
  // this.resetPasswordToken = crypto
  //   .createHash("sha256")
  //   .update(resetToken)
  //   .digest("hex");

  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
  await this.save();
  return resetToken;
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
