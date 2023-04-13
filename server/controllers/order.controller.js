import orderServices from "../services/order.services";
import logisticsService from "../services/logistics.service";
import { get, isEmpty } from "lodash";
import { json } from "body-parser";
const _ = { get, isEmpty };

export const createOrder = async (req, res, next) => {
    orderServices.createOrder(req).then((result) => {
        res.status(result.status).send(result);
    }).catch((err) => {
        res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

export const updateStatus = async (req, res, next) => {
    orderServices.updateStatus(req).then((result) => {
        res.status(result.status).send(result);
    }).catch((err) => {
        res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

export const updateLiveStatus = async (req, res, next) => {
    orderServices.updateLiveStatus(req).then((result) => {
        res.status(result.status).send(result);
    }).catch((err) => {
        res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

export const updateOrder = (req, res) => {
    orderServices.updateOrder(req).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

export const orders = async (req, res, next) => {
    orderServices.orders(req).then((result) => {
        res.status(result.status).send(result);
    }).catch((err) => {
        res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

export const ordersDetails = async (req, res, next) => {
    orderServices.ordersDetails(req, /* options */).then((result) => {
        res.status(result.status).send(result);
    }).catch((err) => {
        res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

export const singleOrders = async (req, res) => {
    const orderId = _.get(req, "params.id", 0);
    orderServices.orderGet(orderId).then((result) => {
        res.status(result.status).send(result);
    }).catch((err) => {
        res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

export const orderSinglethirdparty = async (req, res) => {
    const orderId = _.get(req, "params.id", 0);
    orderServices.orderSinglethirdparty(orderId).then((result) => {
        res.status(result.status).send(result);
    }).catch((err) => {
        res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

export const orderDelete = (req, res) => {
    const bodydata = _.get(req, "params.id", 0);
    orderServices.orderDelete(bodydata).then((result) => {
        res.status(200).send(result)
    }).catch((err) => {
        res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    })
}


// Logistics API

export const thirdPartyAuth = async (req, res, next) => {
    logisticsService.thirdPartyAuth(req).then((result) => {
        res.status(result.status).send(result);
    }).catch((err) => {
        res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

export const getToken = async (req, res, next) => {
    logisticsService.getToken(req).then((result) => {
        res.status(result.status).send(result);
    }).catch((err) => {
        res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};