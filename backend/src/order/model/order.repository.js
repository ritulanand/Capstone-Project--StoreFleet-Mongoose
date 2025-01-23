import OrderModel from "./order.schema.js";
import ProductModel from "../../product/model/product.schema.js";

export const createNewOrderRepo = async (data) => {

  // rearranging orderedItems as it contains only product id and quantity
  const orderedItemsUpdated = await restructureOrderedItems(data.orderedItems);
  console.log("orderitem", orderedItemsUpdated);
  data.orderedItems = orderedItemsUpdated;

  data["itemsPrice"] = calulateItemPrice(data.orderedItems);
  data["totalPrice"] = data.itemsPrice + data.taxPrice + data.shippingPrice;
  return new OrderModel(data).save();
};

const restructureOrderedItems = async (data) => {
  let newData = [];
  for (let item of data) {
    console.log("item", item);
    let product = await ProductModel.findById(item.product);
    console.log("product", product);
    let name = product.name;
    let price = product.price;
    let image = product.images[0] ? product.images[0] : "ImageisNotAvaible";
    item = { ...item, name, price, image };
    newData.push(item);
  }
  return newData;
};

const calulateItemPrice = (arr) => {
  let price = 0;
  for (let ele of arr) {
    price += ele.price * ele.quantity;
  }
  console.log("price", price);
  return price;
};

export const updateOrderRepo = async (_id, status) => {
  return await OrderModel.findByIdAndUpdate(
    _id,
    { $set: { orderStatus: status } },
    { new: true }
  );
};

export const getAllOrdersPlacedForAdminRepo = async () => {
  return await OrderModel.find({});
};


export const getOrderRepo = async (orderId, user) => {
  const order = await OrderModel.findById(orderId);
  console.log("order", order);
  console.log(user.role, user._id.toString(), order.user.toString());
  if (user.role === "admin" || user._id.toString() == order.user.toString()) {
    console.log("user id and orderid match");
    return order;
  } else {
    throw new Error("Only admin or users who have placed this order can view this order.");
  }
};


export const getMyOrdersRepo = async (myId) => {
  return await OrderModel.find({ user: myId });
};
