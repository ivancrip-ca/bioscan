import { DataTypes } from "sequelize";
import db from '../config/db.js';

const EquiposImg = db.define('equipos_imagenes', {
    EquipImg_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true
    },
    EquipImg_Dir: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    EquipImg_EquipId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false,
});

export default EquiposImg;
