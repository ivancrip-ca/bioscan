import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';
import db from '../config/db.js'

const Usuario = db.define('usuarios', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Usu_Usuario:{
        type: DataTypes.STRING,
        allowNull:false
    },
    Usu_Password:{
        type: DataTypes.STRING,
        allowNull:false
    },

}, {
    hooks:{
        beforeCreate: async function(usuario){
            const salt = await bcrypt.genSalt(10)
            usuario.Usu_Password = await bcrypt.hash(usuario.Usu_Password, salt);
            
        }
    },
    scopes: {
        eliminarPassword:{
            attributes:{
                exclude:['Usu_Password', 'createdAt', 'updatedAt']
            }
        }
    }
})

//Metodos personalizados
Usuario.prototype.verificarPassword = function(Usu_Password){
    return bcrypt.compareSync(Usu_Password, this.Usu_Password);
}



export default Usuario