

import { sendPasswordResetEmail } from "../../../utils/emails/passwordReset.js";
import { sendWelcomeEmail } from "../../../utils/emails/welcomeMail.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";
import { sendToken } from "../../../utils/sendToken.js";
import {
  createNewUserRepo,
  deleteUserRepo,
  findUserForPasswordResetRepo,
  findUserRepo,
  getAllUsersRepo,
  updateUserProfileRepo,
  updateUserRoleAndProfileRepo,
} from "../models/user.repository.js";
import crypto from "crypto";

export const createNewUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return next(new ErrorHandler(400, "Please enter name/email/password"));
    }

    const user = await findUserRepo({ email });
    console.log("user>>", user);

    //  handle error for duplicate email
    if (user) {
      return next(new ErrorHandler(409, "Email already registered."));
    }

    const newUser = await createNewUserRepo(req.body);
    console.log("neew user", newUser);
    await sendToken(newUser, res, 200);

    // Implement sendWelcomeEmail function to send welcome message
    await sendWelcomeEmail(newUser);
  } catch (err) {
    //  handle error for duplicate email
    return next(new ErrorHandler(400, err));
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler(400, "please enter email/password"));
    }
    const user = await findUserRepo({ email }, true);
    if (!user) {
      return next(
        new ErrorHandler(401, "user not found! register yourself now!!")
      );
    }
    const passwordMatch = await user.comparePassword(password);
    console.log("password match", passwordMatch);
    if (!passwordMatch) {
      return next(new ErrorHandler(401, "Invalid email or passswor!"));
    }
    await sendToken(user, res, 200);
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const logoutUser = async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({ success: true, msg: "logout successful" });
};

export const forgetPassword = async (req, res, next) => {
  // Implement feature for forget password
  const {email} = req.body;
  try{
    if(!email){
      return next(new ErrorHandler(400, "Please enter email"));
    }
    const user = await findUserRepo({email});
    console.log("user>>>", user);
    if(!user){
      return next(new ErrorHandler(404, "user not found"));
    }
    const token = await user.getResetPasswordToken();
    console.log("token reset", token);
    // const  resetPasswordURL = `http://localhost:${process.env.PORT}/api/storefleet/users/password/reset/${token}`;
    sendPasswordResetEmail(user, token);
    res.status(200).json({success : true, msg : "Please check Email for resetting your password ⚠️"});
  }catch(error){
    return next(new ErrorHandler(400, error));
  }
};

export const resetUserPassword = async (req, res, next) => {
  // Implement feature for reset password
  const token = req.params.token;
  try{
    const user = await findUserForPasswordResetRepo(token);
    console.log("user rrset pass", user);
    if(!user){
      return next(new ErrorHandler(401, "token expired/ invalid token. please request for fresh token"));
    }
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if(password !== confirmPassword){
      return next(new ErrorHandler(400, "password and confirm password do not match."))
    }
    user.password = password;
    await user.save();
    res.status(200).json({success: true, msg: "password reset successful"});
  }catch(error){
    return next(new ErrorHandler(400, error));
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const userDetails = await findUserRepo({ _id: req.user._id });
    console.log("user details", userDetails);
    res.status(200).json({ success: true, userDetails });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  try {
    if (!currentPassword) {
      return next(new ErrorHandler(401, "pls enter current password"));
    }

    const user = await findUserRepo({ _id: req.user._id }, true);
    console.log("user update pass", user);
    const passwordMatch = await user.comparePassword(currentPassword);
    if (!passwordMatch) {
      return next(new ErrorHandler(401, "Incorrect current password!"));
    }

    if (!newPassword || newPassword !== confirmPassword ) {
      return next(
        new ErrorHandler(401, "mismatch new password and confirm password!")
      );
    }

    user.password = newPassword;
    await user.save();
    await sendToken(user, res, 200);
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const updateUserProfile = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    let data  = {};
    if(!name && !email) {
      return next(new ErrorHandler(400, "Name/email is required"));
    }
    if(email){
      const emailExistedInDb = await findUserRepo({email});
      if(emailExistedInDb){
        return next(new ErrorHandler(409, "Email alredy registered. use different email"))
      }
      data = {...data, email};
    }
    if(name){
      data = {...data, name};
    }
    const updatedUserDetails = await updateUserProfileRepo(req.user._id, data);
    console.log("updated user details", updatedUserDetails);
    res.status(201).json({ success: true, updatedUserDetails });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

// admin controllers
export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await getAllUsersRepo();
    console.log("all users", allUsers);
    res.status(200).json({ success: true, allUsers });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const getUserDetailsForAdmin = async (req, res, next) => {
  console.log("req.paramas", req.params);
  try {
    const userDetails = await findUserRepo({ _id: req.params.id });
    console.log("user deatils", userDetails);
    if (!userDetails) {
      return res
        .status(400)
        .json({ success: false, msg: "no user found with provided id" });
    }
    res.status(200).json({ success: true, userDetails });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserRepo(req.params.id);
    console.log("deleted user", deleteUser);
    if (!deletedUser) {
      return res
        .status(400)
        .json({ success: false, msg: "no user found with provided id" });
    }

    res
      .status(200)
      .json({ success: true, msg: "user deleted successfully", deletedUser });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const updateUserProfileAndRole = async (req, res, next) => {
  
  const _id = req.params.id;
  const {name, email, role} = req.body;
  try{
    const user = await findUserRepo({_id});
    console.log("user update profile", user);
    if (!user) {
      return res.status(400).json({ success: false, msg: "no user found with provided id" });
    }
    const updatedUser = await updateUserRoleAndProfileRepo(_id, req.body);
    console.log("updated user", updatedUser);
    res.status(200).json({ success: true, msg: "user profile and role updated successfully", updatedUser });
  }catch(error){
    return next(new ErrorHandler(500, error));
  }
};
