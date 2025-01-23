import ProductModel from "./product.schema.js";

export const addNewProductRepo = async (product) => {
  console.log("[product]", product);  
  return await new ProductModel(product).save();
};

export const getAllProductsRepo = async () => {
  return await ProductModel.find({});
};

export const updateProductRepo = async (_id, updatedData) => {
  return await ProductModel.findByIdAndUpdate(_id, updatedData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
};

export const deleProductRepo = async (_id) => {
  return await ProductModel.findByIdAndDelete(_id);
};

export const getProductDetailsRepo = async (_id) => {
  return await ProductModel.findById(_id);
};

export const getTotalCountsOfProduct = async () => {
  return await ProductModel.countDocuments();
};

export const findProductRepo = async (productId) => {
  return await ProductModel.findById(productId);
};


export const  filterProductByQueriesRepo = async ({category, minPrice, maxPrice,keyword}) => {
  // console.log("cat price", category, price);
  let filters = {};
// console.log("query", query);
if(category){
  filters.category = category;
}
if (keyword) {
  console.log("query key", keyword);
  filters.name = { $regex: keyword, $options: "i" }; // fetching all upper and lowercase
}
if(minPrice || maxPrice){
  // filters.price.$lte = parseInt(price);
  filters.price = {};
        if (minPrice) {
          filters.price.$gte = parseInt(minPrice);
        }
        if (maxPrice) {
          filters.price.$lte = parseInt(maxPrice);
        }
}


  console.log("filters:>>", filters);
  // console.log("product model", ProductModel);
  const products = await ProductModel.find(filters);
  console.log("products", products);
  return products;
};

