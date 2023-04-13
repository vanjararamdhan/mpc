"use strict";
import dbHelper from '../common/dbHelper';

export default (sequelize, DataTypes) => {
    const WhatsappNotification = sequelize.define("whatsapp", {
        phone: {
            type: DataTypes.STRING,
            field: "phone",
            validate: {
                notEmpty: { msg: "phone number is required" },
                isUnique: dbHelper.isUnique("whatsapp", "phone", {
                    msg: "Phone number is already in use"
                })
            }
        },
        message: {
            type: DataTypes.STRING,
            field: "message",
            validate: {
                notEmpty: { msg: "message is required" }
            }
        },
    }, {
        freezeTableName: true,
        tableName: "whatsapp",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });

    return WhatsappNotification;
};
