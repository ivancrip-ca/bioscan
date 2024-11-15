import express from 'express';
import protegerRuta from '../middleware/protegerRuta.js';
import upload from '../middleware/uploads.js';

import { vistaRegistroEquipos, registrarEquipo, subirArchivos, vistaMantenimiento, registrarMantenimiento, vistaEquipoMantenimiento, actualizarStatus, vistaProgramarMante} from '../controllers/EquiposController.js';


const router = express.Router();

router.post('/subir-imagenes/:sucursalId', subirArchivos);
router.post('/subir-documento/', upload.single('documento'), (req, res) =>{
    console.log(req.file);
    res.send('Termina');
})


// Ruta para mostrar el formulario de registro de equipos con el ID de la sucursal
router.get('/equipos/:sucursalId', protegerRuta, vistaRegistroEquipos);

// Ruta para procesar el formulario de registro de equipos
router.post(
    '/equipos/:sucursalId',
    protegerRuta, // Asegura que el token CSRF sea verificado antes de manejar los archivos
    registrarEquipo
);

router.get('/mantenimiento/:id', protegerRuta, vistaMantenimiento)
router.post('/mantenimiento/:id', protegerRuta, registrarMantenimiento)


router.get('/vista/:id', protegerRuta, vistaEquipoMantenimiento)
router.post('/actualizar/:id', protegerRuta, actualizarStatus)
router.get('/programarmante/:id', protegerRuta, vistaProgramarMante)
router.post('/programar/:id', protegerRuta, )


export default router;
