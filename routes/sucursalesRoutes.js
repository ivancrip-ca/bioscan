import express from 'express'
import {vistaSucursales, informacionSucursal, infoEquipo, eliminarEquipo} from '../controllers/SucursalesController.js'
import protegerRuta from '../middleware/protegerRuta.js'
const router = express.Router()



router.get('/sucursales',protegerRuta,vistaSucursales );

router.get('/informacion/:id', protegerRuta, informacionSucursal)

router.get('/infoequipo/:id', protegerRuta, infoEquipo);

router.post('/eliminar/:id', protegerRuta, eliminarEquipo);



export default router