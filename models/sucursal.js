import { DataTypes } from "sequelize";
import db from '../config/db.js';
import Color from './colors.js'; 

const Sucursal = db.define('sucursales', {
    Suc_Id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey: true, // Asegúrate de definir la clave primaria si es necesario
        autoIncrement: true,
    },
    Suc_Nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Suc_IdColor: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        references:{
            model: Color,
            key: 'Col_Id'
        }
    },
    Suc_Ubicacion: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false, // Esto desactiva createdAt y updatedAt
});

Sucursal.belongsTo(Color, { foreignKey: 'Suc_IdColor' });

export default Sucursal;
