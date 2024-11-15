import { DataTypes } from "sequelize";
import db from '../config/db.js';

const Empleados = db.define('empleados', {
    Emp_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    Emp_Nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Emp_Huella: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    Emp_Horas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Emp_Sueldo: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Emp_Status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    Emp_FormaPago: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Emp_DiasPago: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    Emp_SueldoFinal: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Emp_SucursalId:{
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false,
  });
  
 export default Empleados
