import whatsappServices from "../services/Whatsapp.service";
import { get, isEmpty } from "lodash";
import { json } from "body-parser";
const _ = { get, isEmpty };

export const createNotification = async (req, res, next) => {
    whatsappServices.createNotification(req).then((result) => {
        res.status(result.status).send(result);
    }).catch((err) => {
        res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};
