import { DataTypes } from "sequelize";
import db from '../config/db.js';
import Sucursal from "./sucursal.js";
const Equipos = db.define('equipos', {
    Equip_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true
    },
    Equip_Nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Equip_NoSerie:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Equip_Tipo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Equip_IdSucur:{
        type: DataTypes.STRING,
        allowNull: false,
        references:{
            model: Sucursal,
            key: "Suc_Id"
        }
    }
    
}, {
    timestamps: false,
});

export default Equipos;
