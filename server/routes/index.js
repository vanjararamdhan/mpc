import express from "express";
const router = express.Router();

// Routes files

import UserRoutes from "./user.routes";
import OrderRoutes from "./order.routes";
import whatsappRoutes from "./whatsapp.routes";
import logicticsRoutes from "./lodictics.routes";

router.use("/user", UserRoutes);
router.use("/order", OrderRoutes);
router.use("/whatsappNotification", whatsappRoutes);
router.use("/logictic", logicticsRoutes);


// Redirect when no route matches (Wildcard)
router.use('/*', (req, res, next) => {
  next({ status: 404, message: "The page not found!" });
});

export default router;
