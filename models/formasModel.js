import { DataTypes } from "sequelize";
import db from '../config/db.js';

const Formas = db.define('formas', {
    Forma_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,   
        autoIncrement: true
    },
    Forma_Nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Forma_NoDias:{
        type: DataTypes.MEDIUMINT, 
        allowNull: false
    }
}, {
    timestamps: false,
});

export default Formas;
