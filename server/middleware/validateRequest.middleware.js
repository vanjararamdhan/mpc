import statusConst from "../common/statusConstants";
import { validationResult } from "express-validator";
import validator from "../validators/index";

export default (req, res, next) => {

  // Validate request
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = validator.format(errors.array());

    return res.status(400).send({ status: 400, errors: formatted });
  }

  // Send cursor to next request
  next();
}