import express from 'express'
import {formularioLogin, autenticar, cerrarSesion, registrarUsuario} from '../controllers/UsuarioController.js'
import protegerRuta from '../middleware/protegerRuta.js'

const router = express.Router();

router.get('/login',formularioLogin );
router.post('/login', autenticar );
router.post('/registrar', protegerRuta, registrarUsuario)

//Cerrar Sesion
router.post('/cerrar-sesion', cerrarSesion)

export default router