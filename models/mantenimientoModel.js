import { DataTypes } from "sequelize";
import db from '../config/db.js';

const Mantenimiento = db.define('mantenimiento', {
    Mant_Id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true,
    },
    Mant_Titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Mant_Descripcion:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    Mant_Usuario:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    Mant_IdEquipo:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Mant_Costo:{
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    Mant_DiaMant:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    Mant_Status:{
        type: DataTypes.TINYINT,
        allowNull: false
    }
}, {
    timestamps: false,
});

export default Mantenimiento;
