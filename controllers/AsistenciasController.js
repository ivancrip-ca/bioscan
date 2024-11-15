// controllers/empleadosController.js
import Empleados from '../models/empleadosModel.js';
import ExcelJS from 'exceljs';
import  { Op } from 'sequelize';
import Sucursal from '../models/sucursal.js';
import Formas from '../models/formasModel.js';
import Asistencias from '../models/asistenciasModel.js';


const exportarEmpleadosExcel = async (req, res) => {
    try {
        // Obtén todos los empleados
        const empleados = await Empleados.findAll();

        // Crea un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Empleados');

        // Define los encabezados de las columnas
        worksheet.columns = [
            { header: 'ID', key: 'Emp_Id', width: 10 },
            { header: 'Nombre', key: 'Emp_Nombre', width: 50 },
            { header: 'Sucursal', key: 'Emp_SucursalId', width: 30 },
            { header: 'Horas de trabajo diarias', key: 'Emp_Horas', width: 30 },
            { header: 'Sueldo', key: 'Emp_Sueldo', width: 15 },
            { header: 'Forma de pago', key: 'Emp_FormaPago', width: 20 },
            { header: 'Sueldo diario', key: 'Emp_SueldoFinal', width: 20 },
        ];

        // Agrega las filas con los datos de empleados
        empleados.forEach((empleado) => {
            worksheet.addRow({
                Emp_Id: empleado.Emp_Id,
                Emp_Nombre: empleado.Emp_Nombre,
                Emp_SucursalId: empleado.Emp_SucursalId,
                Emp_Horas: empleado.Emp_Horas,
                Emp_Sueldo: empleado.Emp_Sueldo,
                Emp_FormaPago: empleado.Emp_FormaPago,
                Emp_SueldoFinal: empleado.Emp_SueldoFinal,
            });
        });

        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses comienzan desde 0
        const año = String(fecha.getFullYear()).slice(-2); // Solo los dos últimos dígitos del año

        // Generar el nombre del archivo con la fecha
        const nombreArchivo = `empleados${dia}_${mes}_${año}.xlsx`;

       

        // Configura los encabezados de respuesta HTTP para la descarga
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${nombreArchivo}`);

        // Escribe el archivo y envíalo en la respuesta
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al exportar empleados a Excel:', error);
        res.status(500).send('Error al exportar empleados');
    }
};

const exportarEmpleadosExcelAsistencias = async (req, res) => {

    
    try {
        console.log(req.query)
        // Obtén las fechas de inicio y fin del rango del filtro
        let fechaInicio = req.query.fechaInicio;
        let fechaFin = req.query.fechaFin;

        console.log(fechaInicio)
        console.log(fechaFin)

        // Verifica que ambas fechas estén presentes
        if (!fechaInicio || !fechaFin) {
            return res.status(400).send('Por favor, proporciona un rango de fechas válido.');
        }

        // Filtra las asistencias en el rango de fechas
        const asistencias = await Asistencias.findAll({
            where: {
                Asist_Dia: {
                    [Op.between]: [fechaInicio, fechaFin]
                }
            }
        });

        // Crea un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Asistencias');

        // Define los encabezados de las columnas
        worksheet.columns = [
            { header: 'ID del empleado', key: 'Asist_IdEmpleado', width: 20 },
            { header: 'Horas totales de trabajo', key: 'Asist_HorasTotales', width: 30 },
            { header: 'Nombre del empleado', key: 'Asist_NombreEmpleado', width: 30 },
            { header: 'Sucursal', key: 'Asist_Sucursal', width: 20 },
            { header: 'Hora de llegada', key: 'Asist_Llegada', width: 20 },
            { header: 'Hora de salida', key: 'Asist_Salida', width: 20 },
            { header: 'Sueldo diario', key: 'Asist_PagoDia', width: 15 },
            { header: 'Fecha', key: 'Asist_Dia', width: 20 },
        ];

        // Agrega las filas con los datos de empleados
        asistencias.forEach((asistencia) => {
            worksheet.addRow({
                Asist_IdEmpleado: asistencia.Asist_IdEmpleado,
                Asist_HorasTotales: asistencia.Asist_HorasTotales,
                Asist_NombreEmpleado: asistencia.Asist_NombreEmpleado,
                Asist_Sucursal: asistencia.Asist_Sucursal,
                Asist_Llegada: asistencia.Asist_Llegada,
                Asist_Salida: asistencia.Asist_Salida,
                Asist_PagoDia: asistencia.Asist_PagoDia,
                Asist_Dia: asistencia.Asist_Dia,
            });
        });

        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = String(fecha.getFullYear()).slice(-2);

        // Generar el nombre del archivo con la fecha
        const nombreArchivo = `asistencias_${dia}_${mes}_${año}.xlsx`;

        // Configura los encabezados de respuesta HTTP para la descarga
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${nombreArchivo}`);

        // Escribe el archivo y envíalo en la respuesta
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al exportar empleados a Excel:', error);
        res.status(500).send('Error al exportar empleados');
    }
};

const vistaAsistencia = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Página actual, por defecto la primera
        const pageSize = 8; // Tamaño de página, mostrando 8 empleados
        const offset = (page - 1) * pageSize;

        // Obtener las fechas de inicio y fin del rango seleccionado
        let fechaInicio = req.query.fechaInicio;
        let fechaFin = req.query.fechaFin;

        // Convertir las fechas al formato 'DD/MM/YYYY'
        if (fechaInicio && fechaFin) {
            const [startYear, startMonth, startDay] = fechaInicio.split('-');
            fechaInicio = `${startDay}/${startMonth}/${startYear}`;

            const [endYear, endMonth, endDay] = fechaFin.split('-');
            fechaFin = `${endDay}/${endMonth}/${endYear}`;
        }

        // Consulta para obtener las asistencias dentro del rango de fechas
        const asistencias = await Asistencias.findAll({
            where: {
                Asist_Dia: {
                    [Op.between]: [fechaInicio, fechaFin]
                }
            },
            limit: pageSize,
            offset: offset,
        });

        // Obtén solo los empleados de la página actual (si es necesario)
        const empleados = await Empleados.findAll({
            limit: pageSize,
            offset: offset,
        });

        // Calcula la cantidad de páginas si es necesario
        const totalEmpleados = await Empleados.count();
        const totalPaginas = Math.ceil(totalEmpleados / pageSize);

        // Renderiza la vista y pasa los datos
        res.render('asistencias/principal', {
            pagina: 'Personal',
            asistencias,
            csrfToken: req.csrfToken(),
            empleados,
            paginaActual: page,
            totalPaginas,
            fechaInicio: req.query.fechaInicio || '',
            fechaFin: req.query.fechaFin || ''
        });
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        res.status(500).send('Error al obtener empleados');
    }
};

const verEmpleado = async (req, res) => {
    const {id} = req.params;

    try {
        const empleado = await Empleados.findByPk(id);

        if (!empleado) {
            return res.redirect('/asistencias/principal');
        }

        // Obtener todas las sucursales
        const sucursales = await Sucursal.findAll();

        // Obtener todas las formas de pago
        const formasPago = await Formas.findAll();

        res.render('asistencias/ver', {
            csrfToken: req.csrfToken(),
            empleado,
            sucursales, // Pasar las sucursales a la vista
            formasPago, // Pasar las formas de pago a la vista
            pagina: empleado.Emp_Nombre
        });

        

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la información de la sucursal');
    }
};

const eliminarEmpleado = async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminar el empleado por ID
        await Empleados.destroy({
            where: { Emp_Id: id }
        });

        // Redirigir a la lista de empleados en la página actual
        const page = parseInt(req.query.page) || 1; // Obtener la página actual
        res.redirect(`/asistencias/principal?page=${page}`);
    } catch (error) {
        console.error('Error al eliminar al empleado:', error);
        res.status(500).send('Error al eliminar al empleado');
    }
};

const actualizarEmpleado = async (req, res) => {
    const { id } = req.params;
    const { Emp_Nombre, Emp_SucursalId, Emp_FormaNombre, Emp_DiasPago, sueldo } = req.body;

    // Validaciones detalladas de los campos
    if (!Emp_Nombre || !Emp_SucursalId || !Emp_FormaNombre || !Emp_DiasPago || !sueldo) {
        return res.status(400).send('Todos los campos son obligatorios');
    }
    if (Emp_DiasPago <= 0) {
        return res.status(400).send('El campo "Días de Pago" debe ser mayor a 0.');
    }

    try {
        // Actualiza los campos del empleado
        await Empleados.update({
            Emp_Nombre,
            Emp_SucursalId,
            Emp_FormaPago: Emp_FormaNombre,
            Emp_DiasPago,
            Emp_Sueldo: sueldo,
            Emp_SueldoFinal: sueldo / Emp_DiasPago // Recalcula el sueldo final
        }, {
            where: { Emp_Id: id }
        });

        res.redirect(`/asistencias/ver/${id}`); // Redirige a la vista del empleado actualizado
    } catch (error) {
        console.error('Error al actualizar el empleado:', error);
        res.status(500).send('Error al actualizar el empleado');
    }
};



export {
    vistaAsistencia,
    verEmpleado,
    eliminarEmpleado,
    exportarEmpleadosExcel,
    exportarEmpleadosExcelAsistencias,
    actualizarEmpleado
};
