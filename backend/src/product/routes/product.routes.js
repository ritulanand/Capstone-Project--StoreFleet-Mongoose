import express from "express";
import {
  addNewProduct,
  deleteProduct,
  deleteReview,
  getAllProducts,
  getAllReviewsOfAProduct,
  getProductDetails,
  rateProduct,
  updateProduct,
  filterProductByQueries
} from "../controllers/product.controller.js";
import { auth, authByUserRole } from "../../../middlewares/auth.js";

const router = express.Router();

// GET Routes

// product filter
router.route("/products").get(filterProductByQueries);// to ask for price and rate filter logic

router.route("/products/all").get(getAllProducts); // done
router.route("/details/:id").get(getProductDetails);
router.route("/reviews/:id").get(getAllReviewsOfAProduct);

// POST Routes
// admin-only
router.route("/add").post(auth, authByUserRole("admin"), addNewProduct); // done
router.route("/update/:id").put(auth, authByUserRole("admin"), updateProduct); //done

// DELETE ROUTE
// Admin only
router
  .route("/delete/:id")
  .delete(auth, authByUserRole("admin"), deleteProduct);

// POST Routes User
router.route("/rate/:id").put(auth, rateProduct); //done

// DELETE Routes User
router.route("/review/delete").delete(auth, deleteReview); // done


export default router;
