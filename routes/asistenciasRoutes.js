import express from 'express'
import {vistaAsistencia, verEmpleado, eliminarEmpleado, exportarEmpleadosExcel, exportarEmpleadosExcelAsistencias, actualizarEmpleado} from '../controllers/AsistenciasController.js'
import protegerRuta from '../middleware/protegerRuta.js'
const router = express.Router()

router.get('/principal', protegerRuta, vistaAsistencia)
router.get("/ver/:id", protegerRuta, verEmpleado);
router.post('/eliminar/:id', protegerRuta, eliminarEmpleado);
router.post('/editar/:id', protegerRuta, actualizarEmpleado);
router.post('/ver/:id', protegerRuta, actualizarEmpleado);
router.get('/exportar-excel', exportarEmpleadosExcel); // Nueva ruta para exportar a Excel
router.get('/exportar-excel-asistencias',protegerRuta, exportarEmpleadosExcelAsistencias);



export default router