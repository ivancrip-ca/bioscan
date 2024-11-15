import { DataTypes } from "sequelize";
import db from '../config/db.js';
import Equipos from "./equipos.js";

const EquiposDocs = db.define('equipos_documentos', {
    EquipDoc_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true
    },
    EquipDoc_DirDoc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    EquipDoc_EquipId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }

}, {
    timestamps: false,
});

export default EquiposDocs;
