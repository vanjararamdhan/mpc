import statusConst from "../common/statusConstants";
import models from "../models";
import dbHelper from "../common/dbHelper";
import { get, isEmpty, has, isObject, stubTrue } from "lodash";
const _ = { get, isEmpty, has };
import axios from "axios";
import fetch from "node-fetch";
import { response } from "express";

/**
 * Category registrasion
 *
 * @param Request request
 */
const thirdPartyAuth = async (req) => {
    let responseData = statusConst.error;
    try {
        const logdata = {
            email: "amancha.sejal.5057@gmail.com",
            password: "Sejal@1234",
        };
        const orders = await axios.post(
            "https://apiv2.shiprocket.in/v1/external/auth/login",
            logdata
        );
        const userToken = orders.data.token;

        const reslogData = await axios.get(
            "https://apiv2.shiprocket.in/v1/external/orders",
            {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            }
        );

        const logData = reslogData.data;
        const data = logData.data;
        responseData = { status: 200, success: true, userToken, data };
    } catch (error) {
        let errors = {};
        responseData = { status: 400, message: error.message };
        try {
            if (
                ["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(
                    error.name
                )
            ) {
                errors = dbHelper.formatSequelizeErrors(error);
                responseData = { status: 400, errors, success: false };
            }
        } catch (error) {
            responseData = { status: 400, message: error.message };
        }
    }
    return responseData;
};

const getToken = async (req) => {
    let responseData = statusConst.error;
    try {
        const data = {
            email: "amancha.sejal.5057@gmail.com",
            password: "Sejal@1234",
        };
        const orders = await axios.post(
            "https://apiv2.shiprocket.in/v1/external/auth/login",
            data
        );
        const userToken = orders.data.token;

        responseData = { status: 200, success: true, userToken };
    } catch (error) {
        let errors = {};
        responseData = { status: 400, message: error.message };
        try {
            if (
                ["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(
                    error.name
                )
            ) {
                errors = dbHelper.formatSequelizeErrors(error);
                responseData = { status: 400, errors, success: false };
            }
        } catch (error) {
            responseData = { status: 400, message: error.message };
        }
    }
    return responseData;
};

const logisticsService = {
    thirdPartyAuth,
    getToken,
};

export default logisticsService;
