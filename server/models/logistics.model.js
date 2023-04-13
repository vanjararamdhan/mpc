"use strict";
import { INTEGER } from 'sequelize';
import dbHelper from '../common/dbHelper';
import modelConstants from '../common/modelConstants';

export default (sequelize, DataTypes) => {
    const logistics = sequelize.define("logistics", {
        email: {
            type: DataTypes.STRING,
            field: "email",
        },
        password: {
            type: DataTypes.STRING,
            field: "password",
            validate: {
                notEmpty: { msg: "Password is required" },
            }
        },
    }, {
        freezeTableName: true,
        tableName: "logistics",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });
    // Modal associations
    logistics.associate = function (models) {
    };

    logistics.prototype.toJSON = function () {
        var values = Object.assign({}, this.get({ plain: true }));

        if (values.image) {
            let URL = "http://localhost:7000/" + values.image;
            values.image = URL
        }
        return values;
    }
    return logistics;
};