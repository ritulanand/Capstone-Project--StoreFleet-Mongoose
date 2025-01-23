
import { createNewOrderRepo, updateOrderRepo, getAllOrdersPlacedForAdminRepo, getOrderRepo, getMyOrdersRepo } from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

export const createNewOrder = async (req, res, next) => {


  const paidAt = req.body?.paidAt ? new Date(req.body.paidAt) : new Date();
  const data = {
    shippingInfo: {
      address: req.body.shippingInfo.address,
      city: req.body.shippingInfo.city,
      state: req.body.shippingInfo.state,
      country: req.body.shippingInfo.country,
      pincode: req.body.shippingInfo.pincode,
      phoneNumber: req.body.shippingInfo.phoneNumber,
    },
    orderedItems: req.body.orderedItems.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    })),
    user: req.user._id,
    paidAt : paidAt,
    paymentInfo : {
      id : req.body.paymentInfo.id,
      status : req.body.paymentInfo.status // req.body.paymentInfo.status
    },
    taxPrice : req.body.taxPrice,
    shippingPrice: req.body.shippingPrice,
  };
  console.log("data", data);


  if (
    !data.shippingInfo.address ||
    !data.shippingInfo.city ||
    !data.shippingInfo.state ||
    !data.shippingInfo.country ||
    !data.shippingInfo.pincode ||
    !data.shippingInfo.phoneNumber
  ) {
    return next(
      new ErrorHandler(
        406,
        "Incomplete shipping information is not acceptable. Please provide complete shipping information."
      )
    );
  }
  if (data.orderedItems.length == 0) {
    return next(
      new ErrorHandler(400, "There are no items in the orderedtItems. Please select items and then place order.")
    );
  }
  try {
    const orderPlaced = await createNewOrderRepo(data);
    console.log("orderplaced", orderPlaced);
    res.status(201).json({ success: true, orderPlaced });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};


export const updateOrder = async (req, res, next) => {
 
  try {
    const status = req.body.orderStatus;
    console.log("dtatus", status);
    const updatedOrder = await updateOrderRepo(req.params.orderId, status);
    console.log("updatedorder", updateOrder);
    if (!updatedOrder) {
      return next(new ErrorHandler(404, "Order not found!"));
    }
    res.status(200).json({ success: true, updatedOrder });
  } catch (error) {
    return next(new ErrorHandler(400, "Something went wrong."));
  }
};


export const getAllOrdersPlacedForAdmin = async (req, res, next) => {
 
  try {
    const allOrders = await getAllOrdersPlacedForAdminRepo();
    console.log("all orders", allOrders);
    if (allOrders.length == 0) {
      return next(new ErrorHandler(404, "No orders yet!"));
    }
    res.status(200).json({ success: true, allOrders });
  } catch (error) {
    return next(new ErrorHandler(500, "Something went wrong."));
  }
};



export const getOrder = async (req, res, next) => {

  try {
    const orderId = req.params.orderId;
    const order = await getOrderRepo(orderId, req.user);
    if (!order) {
      return next(new ErrorHandler(404, "Order not found!"));
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    return next(new ErrorHandler(401, error));
  }
};




export const getMyOrders = async (req, res, next) => {
  
  const userId = req.user._id;
  try {
    const myOrders = await getMyOrdersRepo(userId);
    console.log("myorders", myOrders);
    if (myOrders.length == 0) {
      return next(new ErrorHandler(404, "Orders not found!"));
    }
    res.status(200).json({ success: true, myOrders });
  } catch (error) {
    return next(new ErrorHandler(500, "Something went wrong."));
  }
};