import { check, validationResult } from 'express-validator'
import { generarJWt, generarId } from '../helpers/tokens.js'
import Usuario from '../models/usuariosModel.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar sesión",
        csrfToken: req.csrfToken()
    })
}

const autenticar = async(req, res) => {
    await check('Usu_Password').notEmpty().withMessage('La contraseña no puede estar vacía').run(req)
    await check('Usu_Usuario').notEmpty().withMessage('El usuario no puede estar vacío').run(req)

    let resultado = validationResult(req)



    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        //Errores
        return res.render('auth/login', {
            pagina: "Iniciar sesión",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    //Comprobar si el usuario existe
    const{Usu_Usuario, Usu_Password} = req.body
    const usuario = await Usuario.findOne({where: {Usu_Usuario}})


    if(!usuario){
        return res.render('auth/login', {
            pagina: "Iniciar sesión",
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario no existe' }],
        })
    }



    //Revisar el password
    if(!usuario.verificarPassword(Usu_Password)){
        return res.render('auth/login', {
            pagina: "Iniciar sesión",
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'La contraseña es incorrecta' }],
        })
    }

    //Autenticar el usuario
    const token = generarJWt({id:usuario.id, nombre: usuario.Usu_Usuario})
    console.log(token)

    //Almacenar en un cookie

    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true
        //sameSite:true
    }).redirect('/panelcontrol/sucursales')
}

const cerrarSesion = (req, res) =>{
    res.clearCookie('_token').status(200);
    
    
    return res.render('auth/login', {
        pagina: "Iniciar sesión",
        csrfToken: req.csrfToken(),
        errores: [{ msg: 'Has cerrado sesión' }],
    })
}

const registrarUsuario = (req, res) =>{
    
}




export{
    formularioLogin,
    autenticar,
    cerrarSesion,
    registrarUsuario
}