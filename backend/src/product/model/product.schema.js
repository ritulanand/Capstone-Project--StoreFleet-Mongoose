import { timeStamp } from "console";
import mongoose from "mongoose";

const producSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "product description name is required"],
      minLength: [
        10,
        "product description should be atleat 10 characters long",
      ],
    },
    price: {
      type: Number,
      required: [true, "product price  is required"],
      maxLength: [8, "price can be of maximum 8 digits"],
    },
    rating: {
      type: Number,
      get : function (){
        if(this.reviews && this.reviews.length > 0){
          return this.reviews.reduce((acc, review) => acc+ review.rating, 0) / this.reviews.length;
        }else{
          return 0
        }
      },
      // default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          default : "public_Id",
          required: true,
        },
        url: {
          type: String,
          default : "img_url"
        },
      },
    ],
    category: {
      type: String,
      required: [true, "product category is required"],
      enum: [
        "Mobile",
        "Electronics",
        "Clothing",
        "Home & Garden",
        "Automotive",
        "Health & Beauty",
        "Sports & Outdoors",
        "Toys & Games",
        "Books & Media",
        "Jewelry",
        "Food & Grocery",
        "Furniture",
        "Shoes",
        "Pet Supplies",
        "Office Supplies",
        "Baby & Kids",
        "Art & Collectibles",
        "Travel & Luggage",
        "Music Instruments",
        "Electrical Appliances",
        "Handmade Crafts",
      ],
    },
    stock: {
      type: Number,
      required: [true, "product stock is mandatory"],
      maxLength: [5, "stock can be maximum 5 digits"],
      default: 1,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  timeStamp
);

const ProductModel = mongoose.model("Product", producSchema);
// console.log("product model", ProductModel);
export default ProductModel;
