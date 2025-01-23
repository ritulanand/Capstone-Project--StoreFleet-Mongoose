

import express from "express";
import {
  createNewUser,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getUserDetails,
  getUserDetailsForAdmin,
  logoutUser,
  resetUserPassword,
  updatePassword,
  updateUserProfile,
  updateUserProfileAndRole,
  userLogin,
} from "../controller/user.controller.js";
import { auth, authByUserRole } from "../../../middlewares/auth.js";

const router = express.Router();

// User POST Routes
router.route("/signup").post(createNewUser); // done
router.route("/login").post(userLogin); // done
router.route("/password/forget").post(forgetPassword); //done

// User PUT Routes
router.route("/password/reset/:token").put(resetUserPassword); // done
router.route("/password/update").put(auth, updatePassword); // done
router.route("/profile/update").put(auth, updateUserProfile); //done

// User GET Routes
router.route("/details").get(auth, getUserDetails); //done
router.route("/logout").get(auth, logoutUser); //done

// Admin GET Routes
router.route("/admin/allusers").get(auth, authByUserRole("admin"), getAllUsers); //done
router
  .route("/admin/details/:id")
  .get(auth, authByUserRole("admin"), getUserDetailsForAdmin); //done

// Admin DELETE Routes
router
  .route("/admin/delete/:id")
  .delete(auth, authByUserRole("admin"), deleteUser);//done

// Admin PUT Routes
// Implement route for updating role of other users

router.route("/admin/update/:id").put(auth, authByUserRole("admin"), updateUserProfileAndRole); //done

export default router;
