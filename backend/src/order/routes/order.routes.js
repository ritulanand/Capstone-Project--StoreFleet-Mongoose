import express from "express";
import { createNewOrder,  updateOrder, getAllOrdersPlacedForAdmin, getOrder, getMyOrders} from "../controllers/order.controller.js";
import { auth, authByUserRole } from "../../../middlewares/auth.js";

const router = express.Router();

router.route("/new").post(auth, createNewOrder);
// put when to update new object
//patch when to update few key field

// get routes
router.route("/:orderId").get(auth, getOrder);
router.route("/my/orders").get(auth, getMyOrders);

//admin routes
router.route("/orders/placed").get(auth, authByUserRole("admin"), getAllOrdersPlacedForAdmin);

// put routes
router.route("/update/:orderId").patch(auth, authByUserRole("admin"), updateOrder);




export default router;
