import express from 'express';
const router = express.Router();

import validateRequest from "../middleware/validateRequest.middleware";
import { createOrder, updateOrder, orders, singleOrders, orderDelete, ordersDetails, updateStatus, updateLiveStatus, orderSinglethirdparty } from "../controllers/order.controller";
import authMiddleware from "../middleware/auth.middleware";
import { createValidation, updateItemValidation } from "../validators/order.validatior";

// User routes 
router.post("/create", [authMiddleware, createValidation, validateRequest], createOrder);
router.put("/updateStatus", [authMiddleware], updateStatus);

router.put("/updateStatusLive", [authMiddleware], updateLiveStatus);

router.put("/:id", [authMiddleware, updateItemValidation, validateRequest], updateOrder);

router.get("/", authMiddleware, orders);
router.get("/orderDetails/", authMiddleware, ordersDetails); // Third-party
router.get("/:id", authMiddleware, singleOrders);
router.get("/singleOrder/:id", authMiddleware, orderSinglethirdparty);// Third-party

router.delete("/:id", orderDelete)

export default router;