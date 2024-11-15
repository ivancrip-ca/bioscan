import Usuario from '../models/usuariosModel.js'

const vistaConfiguracion = async(req, res) =>{
    try {
        // Obtén todos los usuarios de la base de datos
        const usuarios = await Usuario.findAll();
    
    
    res.render('configuracion/opciones', {
        pagina: 'Opciones de configuración',
        usuarios,
        csrfToken: req.csrfToken()
    })
}catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los usuarios');
}

};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminar el empleado por ID
        await Usuario.destroy({
            where: {id}
        });

        // Redirigir a la lista de empleados en la página actual
        const page = parseInt(req.query.page) || 1; // Obtener la página actual
        res.redirect(`/configuracion/opciones`);
    } catch (error) {
        console.error('Error al eliminar al usuario:', error);
        res.status(500).send('Error al eliminar al usuario');
    }
};

const registrarEquipo = async (req, res) =>{

}

export{
    vistaConfiguracion,
    eliminarUsuario,
    registrarEquipo
}