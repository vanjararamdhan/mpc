import { body } from "express-validator";
import { get } from "lodash";

const _ = { get };

/**
 * Validate Login Authentication
 *
 */
export const loginValidation = [
  body("email").not().isEmpty().withMessage("Email is required"),
  body("password").not().isEmpty().withMessage("Password is required"),
];

//  CreateUser
export const createValidation = [
  body("email").not().isEmpty().withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email address is required"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({
      min: 4,
      max: 16,
    })
    .withMessage("Password must be between 4 to 16 characters")
    .matches(/^(?=.*[a-z])(?!.* )(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage("Must contains upper case, lower case, digit, special character"),
  body("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and Confirm password does not match");
      }
      return true;
    }),
  body("userName").not().isEmpty()
    .withMessage("userName is required"),
  body("phone").not().isEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 13 }).withMessage("Incorrect phone number")
    .matches(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/)
    .withMessage("Must contains at least digit & valide mobile number"),
  body("address")
    .not()
    .isEmpty()
    .withMessage("address is required"),
  body("gender")
    .not()
    .isEmpty()
    .withMessage("Gender is reqired"),
  body("role")
    .not()
    .isEmpty()
    .withMessage("Role is reqired"),
];

//  Change password
export const checkAndChangePasswordValidation = [
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
    .withMessage("Must contains upper case, lower case, digit, special character"),
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
//  Change password
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
    .withMessage("Must contains upper case, lower case, digit, special character")
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
export const updateUserValidation = [
  body("email").not().isEmpty().withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email address is required"),
  body("userName").not().isEmpty()
    .withMessage("userName is required"),
  body("phone").not().isEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 13 }).withMessage("Incorrect phone number"),
  body("address")
    .not()
    .isEmpty()
    .withMessage("address is required"),
  body("gender")
    .not()
    .isEmpty()
    .withMessage("Gender is reqired"),
  body("role")
    .not()
    .isEmpty()
    .withMessage("Role is reqired"),
];

export const forgotPasswordValidation = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email address is required"),
];

export const resetPasswordUser = [
  body("newPassword")
    .not()
    .isEmpty()
    .withMessage("newPassword is required")
    .isLength({ min: 4, max: 16 })
    .withMessage("Password must be between 4 to 16 characters")
    .matches(/^(?=.*[a-z])(?!.* )(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage("Must contains at least one upper case, lower case, digit, special character and no white space"),
  body("confirmPassword")
    .not().isEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password and Confirm password does not match");
      }
      return true;
    })
]
