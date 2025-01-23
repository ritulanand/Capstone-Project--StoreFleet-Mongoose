import UserModel from "./user.schema.js";
import mongoose from "mongoose";
import { ObjectId } from "mongoose";

export const createNewUserRepo = async (user) => {
  return await new UserModel(user).save();
};

// please explain
export const findUserRepo = async (factor, withPassword = false) => {
  if (withPassword) {
    console.log("id with pass");
    return await UserModel.findOne(factor).select("+password");
  }
  else {
    console.log("else find user");
    return await UserModel.findOne(factor);
  }
};

export const findUserForPasswordResetRepo = async (hashtoken) => {
  console.log("hashtken", hashtoken);
  return await UserModel.findOne({
    resetPasswordToken: hashtoken,
    resetPasswordExpire: { $gt: Date.now() },
  });
};

export const updateUserProfileRepo = async (_id, data) => {
  return await UserModel.findOneAndUpdate(_id, data, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
};

export const getAllUsersRepo = async () => {
  return UserModel.find({});
};

export const deleteUserRepo = async (_id) => {
  return await UserModel.findByIdAndDelete(_id);
};

export const updateUserRoleAndProfileRepo = async (_id, data) => {
  
  return await UserModel.findByIdAndUpdate(
    _id,
    { $set: { name: data.name, email: data.email, role: data.role } },
    { new: true }
  );
};
