import express from 'express';
const router = express.Router();

import { thirdPartyAuth, getToken } from "../controllers/order.controller";
import authMiddleware from "../middleware/auth.middleware";


// Logistics API

router.get("/logistics", authMiddleware, thirdPartyAuth);

router.get("/getToken", authMiddleware, getToken);

export default router;