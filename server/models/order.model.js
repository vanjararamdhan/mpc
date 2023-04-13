"use strict";
import { INTEGER } from 'sequelize';
import dbHelper from '../common/dbHelper';
import modelConstants from '../common/modelConstants';

export default (sequelize, DataTypes) => {
    const order = sequelize.define("order", {
        orderName: {
            type: DataTypes.STRING,
            field: "order_name",
        },
        address: {
            type: DataTypes.STRING,
            field: "address",
            validate: {
                notEmpty: { msg: "Address is required" }
            }
        },
        pincode: {
            type: DataTypes.STRING,
            field: "pincode",
            validate: {
                notEmpty: { msg: "pincode number is required" }
            }
        },
        phone: {
            type: DataTypes.STRING,
            field: "phone",
            validate: {
                notEmpty: { msg: "phone number is required" },
            }
        },
        email: {
            type: DataTypes.STRING,
            field: "email",
        },
        desing: {
            type: DataTypes.STRING,
            field: "desing",
        },
        image: {
            type: DataTypes.STRING,
            field: "image",
        },
        note: {
            type: DataTypes.STRING,
            field: "note",
        },
        quantity: {
            type: DataTypes.INTEGER,
            field: "quantity",
        },
        price: {
            type: DataTypes.INTEGER,
            field: "price",
        },
        firstname: {
            type: DataTypes.STRING,
            field: "firstname",
        },
        lastname: {
            type: DataTypes.STRING,
            field: "lastname",
        },
        city: {
            type: DataTypes.STRING,
            field: "city",
        },
        province: {
            type: DataTypes.STRING,
            field: "province",
        },
        country: {
            type: DataTypes.STRING,
            field: "country",
        },
        key: {
            type: DataTypes.STRING,
            field: "key",
            defaultValue: "manually",
        },
        orderAssign: {
            type: DataTypes.STRING,
            field: "orderAssign"
        },
        status: {
            type: DataTypes.STRING,
            field: "status",
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: "is_active",
            defaultValue: true,
        }
    }, {
        freezeTableName: true,
        tableName: "order",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });
    // Modal associations
    order.associate = function (models) {
    };

    order.prototype.toJSON = function () {
        var values = Object.assign({}, this.get({ plain: true }));

        if (values.image) {
            let URL = "http://localhost:7000/" + values.image;
            values.image = URL
        }
        return values;
    }
    return order;
};