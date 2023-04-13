"use strict";
import dbHelper from '../common/dbHelper';

export default (sequelize, DataTypes) => {
    const user = sequelize.define("user", {
        userName: {
            type: DataTypes.STRING,
            field: "user_name",
            validate: {
                notEmpty: { msg: "userName is required" },
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: { msg: "Valid email address is required" },
                notEmpty: { msg: "Email is required" },
                isUnique: dbHelper.isUnique("user", "email", {
                    msg: "email is already in use"
                })
            }
        },
        address: {
            type: DataTypes.STRING,
            field: "address",
            validate: {
                notEmpty: { msg: "Address is required" }
            }
        },
        password: {
            type: DataTypes.STRING,
            field: "password",
            validate: {
                notEmpty: { msg: "Password is required" },
            }
        },
        token: {
            field: 'token',
            type: DataTypes.TEXT,
            defaultStatus: null
        },
        phone: {
            type: DataTypes.STRING,
            field: "phone",
            validate: {
                notEmpty: { msg: "phone number is required" },
                isUnique: dbHelper.isUnique("user", "phone", {
                    msg: "Phone number is already in use"
                })
            }
        },
        gender: {
            type: DataTypes.STRING,
            field: "gender",
            validate: {
                notEmpty: { msg: "Geneder is required" }
            }
        },
        role: {
            type: DataTypes.STRING,
            field: "role",
            validate: {
                notEmpty: { msg: "role is required" }
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: "is_active",
            defaultValue: true,
        },
    }, {
        freezeTableName: true,
        tableName: "user",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });

    return user;
};
