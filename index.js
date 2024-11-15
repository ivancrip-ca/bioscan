import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import db from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import sucursalesRoutes from './routes/sucursalesRoutes.js';
import configuracionRoutes from './routes/configuracionRoutes.js';
import asistenciasRoutes from './routes/asistenciasRoutes.js';
import equiposRoutes from './routes/equiposRoutes.js';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const app = express();

const upload = multer({dest: 'public/uploads'})



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Habilitar morgan para ver las peticiones HTTP
app.use(morgan('dev'));

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar cookie parser
app.use(cookieParser());

// Conexión a la base de datos
try {
    await db.authenticate();
    db.sync();
    console.log('Conexión correcta a la base de datos');
} catch (error) {
    console.error('Error de conexión a la base de datos:', error);
}

// Habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta pública
app.use(express.static(path.join(__dirname, 'public')));

// Configurar el servidor HTTP y Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Middleware para pasar io a las rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Habilitar CSRF después de cookie-parser
app.use(csrf({ cookie: true }));

// Middleware para pasar el token CSRF a todas las vistas
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Routing
app.use('/auth', userRoutes);
app.use('/panelcontrol', sucursalesRoutes);
app.use('/configuracion', configuracionRoutes);
app.use('/asistencias', asistenciasRoutes);
app.use('/equipos', equiposRoutes);

// Configurar conexión de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`El servidor está funcionando en el puerto ${port}`);
});
