import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('public/uploads/documents')); // Carpeta donde se guardarán los documentos
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname); // Extensión del archivo
    cb(null, req.body.nombre_documento || `${file.fieldname}-${uniqueSuffix}${extension}`); // Nombre personalizado o nombre generado
  }
});

const upload = multer({ storage: storage });

export default upload;
