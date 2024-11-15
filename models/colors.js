import { DataTypes } from "sequelize";
import db from '../config/db.js';

const Color = db.define('colores', {
    Col_Id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey: true, 
    },
    Col_Nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
});

export default Color;
