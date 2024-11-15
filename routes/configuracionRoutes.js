import express from 'express'
import {eliminarUsuario, vistaConfiguracion} from '../controllers/ConfiguracionController.js'
import protegerRuta from '../middleware/protegerRuta.js'
import { registrarEquipo } from '../controllers/EquiposController.js'
const router = express.Router()

router.get('/opciones', protegerRuta, vistaConfiguracion)
router.post('/eliminar/:id', protegerRuta, eliminarUsuario);
router.post('/registrar', protegerRuta, registrarEquipo)


export default router