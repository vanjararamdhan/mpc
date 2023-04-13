const express = require('express');
const router = express.Router();
const client = require('twilio');
import models from "../models";
import statusConst from "../common/statusConstants";
import dbHelper from "../common/dbHelper";

// const WhatsappNotification = require('../models/whatsapp.model');

const createNotification = async (req) => {
    let responseData = statusConst.error;
    const { phone, message } = req.body;
    try {
        // await WhatsappNotification.create({ phone, message });
        const users = await models.whatsapp.create({ phone, message });
        client.messages
        .create({ from: 'whatsapp:+14155238886', to: `whatsapp:${phone}`, body: message })
        .then(() => res.status(200).send('WhatsApp notification sent'))
        .catch((err) => res.status(500).send(err));
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

const whatsappServices = {
    createNotification
};

export default whatsappServices;
