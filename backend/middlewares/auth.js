import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/errorHandler.js";
import UserModel from "../src/user/models/user.schema.js";

export const auth = async (req, res, next) => {
  const { token } = req.cookies;
  console.log("req cookies", req.cookies);
  console.log("auth checked");
  if (!token) {
    return next(new ErrorHandler(401, "login to access this route!"));
  }
  const decodedData = await jwt.verify(token, process.env.JWT_Secret);
  console.log("decoded ", decodedData);
  req.user = await UserModel.findById(decodedData.id);
  next();
};

export const authByUserRole = (...roles) => {
  // fix this middleware for admin access only
    console.log("roles>>", roles);
  return async (req, res, next) => {
    console.log("req user ", req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          403,
          `Role: ${req.user.role} is not allowed to access this resource`
        )
      );
    }
    next();
  };
};
