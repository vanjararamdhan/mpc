import statusConst from "../common/statusConstants";
import models from "../models";
import dbHelper from "../common/dbHelper";
import Helper from "../common/helper";
import { get, isEmpty, has, isObject, stubTrue } from "lodash";
const _ = { get, isEmpty, has };
import { ASSET_IMAGES_DIR } from "../common/appConstants";
import { Op, where } from "sequelize";
import msgConst from "../common/msgConstants"
import axios from "axios";
import jwt_decode from 'jwt-decode';
import { json } from "body-parser";

/**
 * Category registrasion
 *
 * @param Request request
 */
const createOrder = async (req) => {

    const token = req.tokenUser.dataValues.token;
    const decodeToken = jwt_decode(token);
    const tokenEmail = decodeToken.email;

    let responseData = statusConst.error;
    let { orderName, address, province, pincode, desing, phone, note, quantity, price, firstname, lastname, city, country, email, status } = req.body;
    let filePath;
    let image;
    try {
        if (req.files) {
            let img = req.files.image;
            image = `order-${Date.now().toString()}.${((img.mimetype || "image/jpeg/").split('/')[1]) || 'jpeg'}`;
            filePath = `${ASSET_IMAGES_DIR}${image}`;
            img.mv(filePath, (err) => {
                if (err) {
                    responseData = { status: 200, message: msgConst.uploadFailed };
                }
            });
        }
        const data = {
            order: {
                line_items: [
                    {
                        title: orderName,
                        price: price,
                        quantity: quantity,
                        properties: {
                            Note: note,
                            status: status,
                            key: "manually"
                        }
                    }
                ],
                shipping_address: {
                    first_name: firstname,
                    last_name: lastname,
                    address1: address,
                    phone: phone,
                    city: city,
                    province: province,
                    country: country,
                    zip: pincode
                },
                email: email,
                desing: desing,
            }
        };

        axios.post('https://fdf5b59b169886c43598df10cbaeb0cf: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@my-print-clothe.myshopify.com/admin/api/2022-10/orders.json', data)
        const orders = await models.order.create({ orderName, address, pincode, desing, phone, note, quantity, price, province, firstname, lastname, city, country, email, image, status, orderAssign: tokenEmail });
        responseData = { status: 200, message: "order create successfully", success: true, orders };

    } catch (error) {
        let errors = {};
        responseData = { status: 400, message: error.message };
        try {
            if (["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(error.name)) {
                errors = dbHelper.formatSequelizeErrors(error);
                responseData = { status: 400, errors, success: false };
            }
        } catch (error) {
            responseData = { status: 400, message: error.message };
        }
    }
    return responseData;
};

const updateStatus = async (req,) => {
    let responseData = statusConst.error;
    const { status } = req.body;
    try {
        const filter = {
            where: {
                id: { [Op.in]: req.body.itemIds },
            },
        };
        const updateData = { status: status };
        const data = {
            order: {
                line_items: [
                    {
                        properties: {
                            status: status
                        }
                    }
                ]
            }
        };

        const result = await models.order.update(updateData, filter);
        responseData = { status: 200, message: "status update successfully", success: true, rowsUpdated: result[0] };
    } catch (error) {
        responseData = { status: 400, message: error.message, success: false };
    }
    return responseData;
};

const updateLiveStatus = async (req,) => {
    let responseData = statusConst.error;
    const { status, id } = req.body;
    try {
        const filter = {
            where: {
                id: { [Op.in]: req.body.id },
            },
        };
        const updateData = { status: status };
        const data = {
            order: {
                id: id,
                line_items: [
                    {
                        properties: {
                            status: status
                        }
                    }
                ]
            }
        };
        // axios.put(`https://fdf5b59b169886c43598df10cbaeb0cf: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@my-print-clothe.myshopify.com/admin/api/2022-10/orders/${id}.json`, data)
        const result = await models.order.update(updateData, filter);

        responseData = { status: 200, message: "status update successfully", success: true, rowsUpdated: result[0] };
    } catch (error) {
        responseData = { status: 400, message: error.message, success: false };
    }
    return responseData;
};

const updateOrder = async (req) => {
    let responseData = statusConst.error;
    const { orderName, address, pincode, desing, phone, description } = req.body;
    const { id } = req.params;
    let filePath;
    let image;
    try {
        const orders = await models.order.findOne({ where: { id: id } });
        if (req.files) {
            let img = req.files.image;
            image = `order-${Date.now().toString()}.${((img.mimetype || "image/jpeg/").split('/')[1]) || 'jpeg'}`;
            filePath = `${ASSET_IMAGES_DIR}${image}`;
            img.mv(filePath, (err) => {
                if (err) {
                    responseData = { status: 200, message: msgConst.uploadFailed };
                }
            });
        }
        if (!orders) {
            throw new Error("order not found")
        } else {
            await orders.update({ orderName, address, pincode, desing, phone, image, description });
        }
        responseData = { status: 200, message: "data update successfully", success: true };
    } catch (error) {
        responseData = { status: 400, message: error.message, success: false };
    }
    return responseData;
};

const orders = async (req) => {
    let responseData = statusConst.error;
    const entityParams = _.get(req, "query", {});
    try {
        const status = req.query.status;
        var serviceCondition = status ? { status: { [Op.like]: `%${status}%` } } : null;
        const { pagination } = Helper.dataPagination(entityParams);
        const statusFilter = await models.order.findAll({ where: serviceCondition, })
        const ordersData = await models.order.findAndCountAll();
        if (!ordersData) {
            throw new Error("order not found")
        } else {
            responseData = { status: 200, success: true, statusFilter, ordersData };

            if (ordersData.rows.length > 0) {
                pagination["totalPages"] = Math.ceil(
                    (ordersData || ordersData).count / pagination.pageSize);
                pagination["pageRecords"] =
                    ((ordersData || {}).rows || []).length || 0;
            }
        }
    } catch (error) {
        responseData = { status: 400, message: error.message, success: false };
    }
    return responseData;
};

const ordersDetails = async (req) => {
    const entityParams = _.get(req, "query", {});
    const getData = axios.get('https://fdf5b59b169886c43598df10cbaeb0cf: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@my-print-clothe.myshopify.com/admin/api/2022-10/orders.json')
    const ordersDetails = (await getData).data;
    let responseData = statusConst.error;
    try {
        const { pagination } = Helper.dataPagination(entityParams);
        if (!ordersDetails) {
            throw new Error("order not found")
        } else {
            if (ordersDetails.length > 0) {
                pagination["totalPages"] = Math.ceil((ordersDetails || ordersDetails).count / pagination.pageSize);
                pagination["pageRecords"] = ((ordersDetails || {}) || []).length || 0;
            }
            responseData = { status: 200, success: true, pagination, ordersDetails };

        }
    } catch (error) {
        responseData = { status: 400, message: error.message, success: false };
    }
    return responseData;
};

const orderSinglethirdparty = async (orderId, req) => {
    const entityParams = _.get(req, "query", {});
    const getData = axios.get(`https://fdf5b59b169886c43598df10cbaeb0cf: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@my-print-clothe.myshopify.com/admin/api/2022-10/orders/${orderId}.json`)
    const ordersDetails = (await getData).data;
    let responseData = statusConst.error;
    try {
        const { pagination } = Helper.dataPagination(entityParams);
        if (!ordersDetails) {
            throw new Error("order not found")
        } else {
            if (ordersDetails.length > 0) {
                pagination["totalPages"] = Math.ceil((ordersDetails || ordersDetails).count / pagination.pageSize);
                pagination["pageRecords"] = ((ordersDetails || {}) || []).length || 0;
            }
            responseData = { status: 200, success: true, pagination, ordersDetails };
        }
    } catch (error) {
        responseData = { status: 400, message: error.message, success: false };
    }
    return responseData;
};

const orderGet = async (orderId) => {
    let responseData = statusConst.error;
    try {
        const orderData = await models.order.findOne({
            where: { [Op.and]: { id: orderId } },
        });
        if (orderData) {
            responseData = { status: 200, message: "order fetch successfully", success: true, orderData, };
        } else {
            responseData = { status: 400, message: "order does not exist", success: false, };
        }
    } catch (error) {
        console.log(error);
        responseData = { status: 400, message: "order not found", success: false, };
    }
    return responseData;
};

const orderDelete = async (data) => {
    let responseData = statusConst.error;
    try {
        let orderData = await models.order.findOne({ where: { id: data } });
        if (!orderData) {
            return { status: 404, message: "order not found", success: false, }
        } else {
            orderData.destroy({ where: { id: data } });
        }
        responseData = { status: 200, message: 'order deleted successfully', success: true }
    } catch (error) {
        responseData = { status: 200, message: error.message }
    }
    return responseData
}

const thirdPartyAuth = async (req, res) => {
    const getData = axios.get(`https://apiv2.shiprocket.in/v1/external/orders`)
    const ordersDetails = (await getData).data;
    let responseData = statusConst.error;
    try {
        if (!ordersDetails) {
            throw new Error("order not found")
        } else {
            responseData = { status: 200, success: true, ordersDetails };
        }
    } catch (error) {
        responseData = { status: 400, message: error.message, success: false };
    }
    return responseData;
};


const orderServices = {
    createOrder,
    updateStatus,
    updateLiveStatus,
    updateOrder,
    orders,
    ordersDetails,
    orderSinglethirdparty,
    orderGet,
    orderDelete,

    // logistics

    thirdPartyAuth
};

export default orderServices;
