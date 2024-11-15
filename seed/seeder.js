import {exit} from 'node:process'
import usuarios from './usuario.js'
import db from '../config/db.js'
import Usuario from '../models/usuariosModel.js'

const importarDatos = async() =>{
    try{
        //Autenticar
        await db.authenticate()

        //Generar las columnas
        await db.sync()

        //Insertamos los datos
        

        await Promise.all([
            // Categoria.bulkCreate(categorias),
            // Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])

        console.log('Datos importados correctamente')
        exit()


    }catch(error){
        console.log(error)
        exit(1)
    }
}
if(process.argv[2] === "-i"){
    importarDatos();
 }
 if(process.argv[2] === "-e"){
     eliminarDatos();
  }
