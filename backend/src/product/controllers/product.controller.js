

import { ErrorHandler } from "../../../utils/errorHandler.js";
import {
  addNewProductRepo,
  deleProductRepo,
  findProductRepo,
  getAllProductsRepo,
  getProductDetailsRepo,
  getTotalCountsOfProduct,
  updateProductRepo,
  filterProductByQueriesRepo
} from "../model/product.repository.js";
import ProductModel from "../model/product.schema.js";

export const addNewProduct = async (req, res, next) => {
  try {
    console.log("req body add", req.body);
    const product = await addNewProductRepo({
      ...req.body,
      createdBy: req.user._id,
    });
    console.log("add product", product);
    if (product) {
      res.status(201).json({ success: true, product });
    } else {
      return next(new ErrorHandler(400, "some error occured!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const getAllProducts = async (req, res, next) => {
  // Implement the functionality for search, filter and pagination this function.
  try{
    const products = await getAllProductsRepo();
    console.log("products", products);
    if(products.length == 0){
      return next(new ErrorHandler(404, "No product found"));
    }
    res.status(200).json({success : true, products});
  }catch(error){
    return next(new ErrorHandler(500, "Something went wrong"));
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await updateProductRepo(req.params.id, req.body);
    console.log("updated product", updateProduct);
    if (updatedProduct) {
      res.status(200).json({ success: true, updatedProduct });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await deleProductRepo(req.params.id);
    if (deletedProduct) {
      res.status(200).json({ success: true, deletedProduct });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const getProductDetails = async (req, res, next) => {
  try {
    const productDetails = await getProductDetailsRepo(req.params.id);
    if (productDetails) {
      res.status(200).json({ success: true, productDetails });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const rateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { rating, comment } = req.body;
    const user = req.user._id;
    const name = req.user.name;
    const review = {
      user,
      name,
      rating: Number(rating),
      comment,
    };
    if (!rating) {
      return next(new ErrorHandler(400, "rating can't be empty"));
    }
    const product = await findProductRepo(productId);
    console.log("product", product);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }
    const findRevieweIndex = product.reviews.findIndex((rev) => {
      return rev.user.toString() === user.toString();
    });
    console.log("findreviewindex", findRevieweIndex);
    if (findRevieweIndex >= 0) {
      product.reviews.splice(findRevieweIndex, 1, review);
    } else {
      product.reviews.push(review);
    }
    let avgRating = 0;
    product.reviews.forEach((rev) => {
      avgRating += rev.rating;
    });
    console.log("avg", avgRating);
    const updatedRatingOfProduct = avgRating / product.reviews.length;
    product.rating = updatedRatingOfProduct;
    console.log("updatedrating", updatedRatingOfProduct);
    await product.save({ validateBeforeSave: false });
    res
      .status(201)
      .json({ success: true, msg: "thx for rating the product", product });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const getAllReviewsOfAProduct = async (req, res, next) => {
  try {
    const product = await findProductRepo(req.params.id);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }
    res.status(200).json({ success: true, reviews: product.reviews });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const deleteReview = async (req, res, next) => {
 
  try {
    const { productId, reviewId } = req.query;
    if (!productId || !reviewId) {
      return next(
        new ErrorHandler(
          400,
          "pls provide productId and reviewId as query params"
        )
      );
    }
    const product = await findProductRepo(productId);
    console.log("delete product", product);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }
    const reviews = product.reviews;
    console.log("reviews deleted", reviews);

    const isReviewExistIndex = reviews.findIndex((rev) => {
      return rev._id.toString() === reviewId.toString();
    });
    console.log("isreviewexistindex", isReviewExistIndex);
    if (isReviewExistIndex < 0) {
      return next(new ErrorHandler(400, "review doesn't exist"));
    }

    const reviewToBeDeleted = reviews[isReviewExistIndex];
    console.log("reviewtodeleted", reviewToBeDeleted);
    if (reviewToBeDeleted.user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler(401, "Only review owner can delete this review."));
    }
    reviews.splice(isReviewExistIndex, 1);
    console.log("review splice", reviews);

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      msg: "review deleted successfully",
      deletedReview: reviewToBeDeleted,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(500, "Something went wrong."));
  }
};



export const filterProductByQueries = async (req, res, next) => {
  
  try {
    const query = req.query;
    console.log("re query", req.query);
    const products = await filterProductByQueriesRepo(query);
    console.log("products filetr", products);
    if (products.length == 0) return next(new ErrorHandler(404, "No product found"));
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("eror", error);
    return next(new ErrorHandler(500, "Something went wrong."));
  }
};