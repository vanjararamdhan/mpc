import express from 'express';
const router = express.Router();

import validateRequest from "../middleware/validateRequest.middleware";
import { createUser, login, changePassword, logout, updateUser, userDetails, singleUser, userDelete, forgotPassword, resetPassword, searchUser, checkAndChangePassword } from "../controllers/user.controller";
import authMiddleware from "../middleware/auth.middleware";
import { createValidation, loginValidation, changePasswordValidation, updateUserValidation, forgotPasswordValidation, resetPasswordUser, checkAndChangePasswordValidation } from "../validators/user.validator";

// User routes 
router.post("/create", [authMiddleware, createValidation, validateRequest], createUser);
router.post("/login", loginValidation, validateRequest, login);

router.patch("/change-password", [authMiddleware, changePasswordValidation, validateRequest], changePassword)
router.patch("/check-and-change-password", [authMiddleware, checkAndChangePasswordValidation, validateRequest], checkAndChangePassword)
router.patch("/:id", [authMiddleware, updateUserValidation, validateRequest], updateUser)

router.get("/getall", authMiddleware, userDetails);
router.get("/:id", authMiddleware, singleUser)
router.get("/", authMiddleware, searchUser);

router.delete("/logout", [authMiddleware], logout)
router.delete("/:id", [authMiddleware], userDelete)

router.post("/forgot_password", forgotPasswordValidation, validateRequest, forgotPassword);
router.post("/reset_password/:token", resetPasswordUser, validateRequest, resetPassword);

export default router;
