import { body } from "express-validator";
import { get } from "lodash";

const _ = { get };

//  CreateUser
export const createValidation = [
  body("orderName").not().isEmpty().withMessage("Order Name is required"),
  body("phone")
    .not()
    .isEmpty()
    .withMessage("phone number is required")
    .isLength({ min: 10, max: 13 })
    .withMessage("Incorrect phone number"),
  body("pincode")
    .not()
    .isEmpty()
    .withMessage("pincode number is required")
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage("Invalid Pincode"),
  body("address").not().isEmpty().withMessage("Address is required"),
];

//  Change-password
export const changePasswordValidation = [
  body("currentPassword")
    .not()
    .isEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .not()
    .isEmpty()
    .withMessage("New password is required")
    .isLength({
      min: 4,
      max: 16,
    })
    .withMessage("Password must be between 4 to 16 characters")
    .matches(/^(?=.*[a-z])(?!.* )(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage(
      "Must contains upper case, lower case, digit, special character"
    )
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("Current password and New password cannot be same");
      }
      return true;
    }),
  body("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password and Confirm password does not match");
      }
      return true;
    }),
];

//  updateUser
export const updateItemValidation = [
  body("orderName").not().isEmpty().withMessage("Order Name is required"),
  body("phone")
    .not()
    .isEmpty()
    .withMessage("phone number is required")
    .isLength({ min: 10, max: 13 })
    .withMessage("Incorrect phone number"),
  body("pincode")
    .not()
    .isEmpty()
    .withMessage("pincode number is required")
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage("Invalid Pincode"),
  body("address").not().isEmpty().withMessage("Address is required"),
];
