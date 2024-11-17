import Equipos from '../models/equipos.js';
import EquiposDocs from '../models/equiposDoc.js';
import EquiposImg from '../models/equiposImg.js';
import upload from '../middleware/uploads.js';
import Mantenimiento from '../models/mantenimientoModel.js';
import Sucursal from '../models/sucursal.js';
import { check, validationResult } from 'express-validator';



const vistaRegistroEquipos = (req, res) => {
    const sucursalId = req.params.sucursalId; // Obtener el ID de la sucursal desde la URL
    res.render('equipos/equipos', {
        pagina: 'Registro de equipos',
        csrfToken: req.csrfToken(), // Asegúrate de que esto se está generando
        sucursalId  // Pasar el ID de la sucursal al formulario
    });
};

const registrarEquipo = async (req, res) => {
    // Extraer los datos del cuerpo de la solicitud
    const { nombre, numero_serie, tipo_equipo } = req.body;
    const sucursalId = req.params.sucursalId;

    await check('nombre').notEmpty().withMessage('El nombre del equipo no puede ir vacío').run(req)
    await check('numero_serie').notEmpty().withMessage('El número de serie del equipo no puede ir vacío').run(req)
    await check('tipo_equipo').notEmpty().withMessage('Se debe de seleccionar un tipo de equipo').run(req)

    let resultado = validationResult(req)

    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {

        try {
            // Guardar el equipo en la base de datos
            const equipo = await Equipos.create({
                Equip_Nombre: nombre,
                Equip_NoSerie: numero_serie,
                Equip_Tipo: tipo_equipo,
                Equip_IdSucur: sucursalId,
            });

            console.log('Equipo registrado exitosamente:', equipo);
            res.redirect(`/panelcontrol/informacion/${sucursalId}`);
        } catch (error) {
            console.error('Error al registrar el equipo:', error);
            res.status(500).send('Error al registrar el equipo');
        }
    }

};

const subirArchivos = async (req, res) => {
    try {
        const sucursalId = req.params.sucursalId;

        upload.fields([
            { name: 'documento', maxCount: 1 },
            { name: 'imagenes', maxCount: 10 }
        ])(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al subir los archivos.' });
            }

            // Procesar documento
            if (req.files && req.files['documento'] && req.files['documento'][0]) {
                const documentoPath = `/uploads/documents/${req.files['documento'][0].filename}`;

                await EquiposDocs.create({
                    EquipDoc_Dir: documentoPath,
                    EquipDoc_EquipId: sucursalId,
                });
            }

            // Procesar imágenes
            if (req.files && req.files['imagenes'] && req.files['imagenes'].length > 0) {
                const imagenesPromises = req.files['imagenes'].map(async (file) => {
                    const imagenPath = `/uploads/images/${file.filename}`;

                    return EquiposImg.create({
                        EquipImg_Dir: imagenPath,
                        EquipImg_EquipId: sucursalId,
                    });
                });

                await Promise.all(imagenesPromises);
            }

            res.status(200).json({ message: 'Archivos subidos y guardados correctamente.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar los archivos en la base de datos.' });
    }
};

const vistaMantenimiento = async (req, res) => {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1; // Página actual, por defecto es 1
    const limit = 12; // Máximo de mantenimientos por página
    const offset = (page - 1) * limit; // Calcula el desplazamiento de los resultados

    try {
        // Buscar el equipo por su ID, incluyendo el campo Equip_IdSucur
        const equipo = await Equipos.findByPk(id, {
            attributes: ['Equip_IdSucur', 'Equip_Nombre'] // Incluye el campo Equip_IdSucur
        });

        if (!equipo) {
            return res.status(404).send("Equipo no encontrado");
        }

        // ID de la sucursal que se usará para el botón "Regresar"
        const sucursalId = equipo.Equip_IdSucur;

        // Buscar los mantenimientos con paginación
        const { count, rows: mantenimientos } = await Mantenimiento.findAndCountAll({
            where: { Mant_IdEquipo: id },
            limit: limit,
            offset: offset
        });

        const totalPages = Math.ceil(count / limit); // Número total de páginas

        res.render('equipos/mantenimiento', {
            pagina: 'Mantenimientos',
            equipo,
            mantenimientos,
            csrfToken: req.csrfToken(),
            nombreUsuario: req.usuario.Usu_Usuario,
            id,
            currentPage: page,
            totalPages,
            sucursalId // Pasa sucursalId a la vista
        });
    } catch (error) {
        console.error("Error al obtener los mantenimientos:", error);
        res.status(500).send("Hubo un error al obtener los mantenimientos.");
    }
};

const registrarMantenimiento = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, costo, dia_mantenimiento } = req.body;

    // Verificar qué datos llegan en el body
    console.log("Datos recibidos en el body:", req.body);

    // Validación de los datos
    if (!nombre || !descripcion || !costo || !dia_mantenimiento) {
        console.error("Campos incompletos.");
        return res.status(400).send("Todos los campos son obligatorios.");
    }

    // Elimina las comas del valor de costo
    const costoSinComas = costo.replace(/,/g, '');
    
    // Verificar que costo sea un número
    if (isNaN(costoSinComas)) {
        console.error("Costo no es un número válido.");
        return res.status(400).send("El costo debe ser un número válido.");
    }

    try {
        const mantenimiento = await Mantenimiento.create({
            Mant_Titulo: nombre,
            Mant_Descripcion: descripcion,
            Mant_Usuario: req.usuario?.Usu_Usuario || "Usuario Anónimo",
            Mant_IdEquipo: id,
            Mant_Costo: parseFloat(costoSinComas), // Convierte a número
            Mant_DiaMant: dia_mantenimiento,
            Mant_Status: 0,
        });
        console.log('Mantenimiento registrado exitosamente:', mantenimiento);
        res.redirect(`/equipos/mantenimiento/${id}`);
    } catch (error) {
        console.error("Error al registrar el mantenimiento:", error);
        res.status(500).send("Hubo un error al registrar el mantenimiento.");
    }
};

const vistaEquipoMantenimiento = async (req, res) => {
    const { id } = req.params; // El ID del mantenimiento se pasa en la URL.

    try {

        // Buscar el mantenimiento por su ID
        const mantenimiento = await Mantenimiento.findByPk(id);

        if (!mantenimiento) {
            return res.status(404).send("Mantenimiento no encontrado");
        }

        // Pasar la información del mantenimiento a la vista
        res.render('equipos/vista', {
            pagina: 'Información del mantenimiento',
            mantenimiento,
        });
    } catch (error) {
        console.error("Error al obtener el mantenimiento:", error);
        res.status(500).send("Hubo un error al obtener la información del mantenimiento.");
    }
};

const actualizarStatus = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtiene el registro para verificar el estado actual
        const mantenimiento = await Mantenimiento.findByPk(id);

        // Verifica si el mantenimiento ya está finalizado
        if (mantenimiento && mantenimiento.Mant_Status === 1) {
            return res.render('equipos/vista', { // Asegúrate de que esta ruta sea correcta
                mantenimiento,
                pagina: 'Información del mantenimiento',
                mensajeError: "El mantenimiento ya está finalizado."
            });
        }

        // Actualiza Mant_Status a 1 si no está finalizado
        const [updated] = await Mantenimiento.update(
            { Mant_Status: 1 },
            { where: { Mant_Id: id } }
        );

        if (updated > 0) {
            res.redirect(`/equipos/vista/${id}`);
        } else {
            res.status(404).json({ message: "Registro no encontrado." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error actualizando Mant_Status." });
    }
};

const vistaProgramarMante = async (req, res) => {
    const { id } = req.params; // Obtener el ID de la sucursal desde la URL
    const mantenimiento = await Mantenimiento.findByPk(id, {
        attributes: ['Mant_IdEquipo', 'Mant_Id']
    });
    const idequipo = mantenimiento.Mant_IdEquipo;
    const equipo = await Equipos.findByPk(idequipo, {
        attributes: ['Equip_Nombre']
    });

    res.render('equipos/programarmante', {
        pagina: 'Programación de mantenimiento',
        mantenimiento,
        equipo,
        nombreUsuario: req.usuario.Usu_Usuario,
        csrfToken: req.csrfToken(), // Asegúrate de que esto se está generando
        id  // Pasar el ID de la sucursal al formulario
    });
}


export {
    vistaRegistroEquipos, registrarEquipo, subirArchivos, vistaMantenimiento, registrarMantenimiento, vistaEquipoMantenimiento, actualizarStatus, vistaProgramarMante
}