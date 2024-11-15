import Sucursal from '../models/sucursal.js';
import Equipos from '../models/equipos.js';



const vistaSucursales = async (req, res) => {
    const { id } = req.params;
    let { pagina: paginaActual } = req.query;

    // Asegúrate de que `paginaActual` sea un número entero positivo
    paginaActual = parseInt(paginaActual, 10) || 1;

    if (paginaActual < 1) {
        paginaActual = 1;
    }
    try {
        const limit = 12;
        const offset = (paginaActual - 1) * limit;

        // Obtén el total de sucursales
        const total = await Sucursal.count();

        // Verifica si no hay registros
        if (total === 0) {
            return res.render('panelcontrol/sucursales', {
                pagina: "Sucursales",
                sucursales: [], // No hay sucursales que mostrar
                nombreUsuario: req.usuario.Usu_Usuario,
                csrfToken: req.csrfToken(),
                paginaActual,
                totalPaginas: 0,
                sucursalId: id,
                mensaje: "No hay sucursales disponibles"
            });
        }

        // Obtén las sucursales con paginación
        const sucursales = await Sucursal.findAll({
            limit,
            offset
        });

        // Calcula el total de páginas
        const totalPaginas = Math.ceil(total / limit);

        // Redirige si `paginaActual` es mayor que el total de páginas
        if (paginaActual > totalPaginas) {
            return res.redirect(`/panelcontrol/sucursales?pagina=${totalPaginas}`);
        }

        res.render('panelcontrol/sucursales', {
            pagina: "Sucursales",
            sucursales,
            nombreUsuario: req.usuario.Usu_Usuario,
            csrfToken: req.csrfToken(),
            paginaActual,
            sucursalId: id,
            totalPaginas
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las sucursales');
    }
};


const ITEMS_PER_PAGE = 8;

const informacionSucursal = async (req, res) => {
    const { id } = req.params;
    const { page = 1 } = req.query; // Obtener el número de página de los parámetros de la consulta
    const offset = (page - 1) * ITEMS_PER_PAGE;

    try {
        const sucursal = await Sucursal.findByPk(id);

        if (!sucursal) {
            return res.redirect('/panelcontrol/sucursales');
        }

        // Obtener los equipos que pertenecen a la sucursal específica
        const { count, rows: equipos } = await Equipos.findAndCountAll({
            where: {
                Equip_IdSucur: id // Filtrar por el ID de la sucursal
            },
            limit: ITEMS_PER_PAGE,
            offset: offset,
        });

        const totalPages = Math.ceil(count / ITEMS_PER_PAGE); // Calcular el número total de páginas

        res.render('panelcontrol/informacion', {
            pagina: `${sucursal.Suc_Nombre}`,
            sucursal,
            sucursalId: id,
            csrfToken: req.csrfToken(),
            equipos,
            currentPage: Number(page),
            totalPages,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la información de la sucursal');
    }
};

const infoEquipo = async (req, res) => {
    const { id } = req.params; // Obtén el ID del equipo de los parámetros de la URL

    try {
        const equipo = await Equipos.findByPk(id); // Encuentra el equipo por ID
        
        
            // Buscar el equipo por su ID, incluyendo el campo Equip_IdSucur
            const equipo2 = await Equipos.findByPk(id, {
                attributes: ['Equip_IdSucur'] // Incluye el campo Equip_IdSucur
            });


            const sucursalId = equipo2.Equip_IdSucur;

        if (!equipo) {
            return res.redirect('/panelcontrol/sucursales'); // Redirige si no se encuentra el equipo
        }

        res.render('panelcontrol/infoequipo', {
            pagina: `Información de ${equipo.Equip_Nombre}`,
            equipo,
            csrfToken: req.csrfToken(),
            sucursalId,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la información del equipo');
    }
};

const eliminarEquipo = async (req, res) => {
    try {
        const { id } = req.params;

        const equipo = await Equipos.findByPk(id, {
            attributes: ['Equip_IdSucur'] 
        });


        const idsucur = equipo.Equip_IdSucur;
        // Eliminar el equipo por ID
        await Equipos.destroy({
            where: { Equip_Id: id }
        });

        // Redirigir a la lista de empleados en la página actual
        const page = parseInt(req.query.page) || 1; // Obtener la página actual
        res.redirect(`/panelcontrol/informacion/${idsucur}`);
    } catch (error) {
        console.error('Error al eliminar el equipo:', error);
        res.status(500).send('Error al eliminar el equipo');
    }
};





export { vistaSucursales, informacionSucursal, infoEquipo, eliminarEquipo};
