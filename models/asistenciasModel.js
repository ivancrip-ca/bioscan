import { DataTypes } from "sequelize";
import db from '../config/db.js';

const Asistencias = db.define('asistencias', {
    Asist_Id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey: true, 
    },
    Asist_IdEmpleado: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Asist_HorasTotales:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Asist_NombreEmpleado:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Asist_Llegada:{
        type: DataTypes.TIME,
        allowNull: false
    },
    Asist_Salida:{
        type: DataTypes.TIME,
        allowNull: true
    },
    Asist_Dia:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Asist_PagoDia:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    Asist_Dia:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Asist_Sucursal:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
});

export default Asistencias;
