import express from 'express';
const router = express.Router();

import validateRequest from "../middleware/validateRequest.middleware";
import { createNotification } from "../controllers/whatsapp.controller";
import authMiddleware from "../middleware/auth.middleware";
import { createValidation } from "../validators/user.validator";

// User routes 
// router.post("/whatsapp", [authMiddleware, /* createValidation, */ validateRequest], createNotification);
router.post("/whatsapp", createNotification);

export default router;
