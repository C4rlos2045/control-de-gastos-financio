import multer from 'multer';
import { env } from '../config/env.js';

const almacenamiento = multer.memoryStorage();

const tiposPermitidos = [
  'image/jpeg',
  'image/png'
];

const filtroArchivo = (req, file, cb) => {
  if (!tiposPermitidos.includes(file.mimetype)) {
    const error = new Error(
      'Solo se permiten archivos JPG, JPEG o PNG'
    );

    error.statusCode = 400;
    return cb(error);
  }

  cb(null, true);
};

const upload = multer({
  storage: almacenamiento,
  limits: {
    fileSize:
      env.avatarMaxSizeMb * 1024 * 1024
  },
  fileFilter: filtroArchivo
});

export const subirAvatar = (req, res, next) => {
  const middleware = upload.single('avatar');

  middleware(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        ok: false,
        mensaje:
          error.code === 'LIMIT_FILE_SIZE'
            ? `El avatar no debe superar ${env.avatarMaxSizeMb} MB`
            : 'Error al procesar el archivo'
      });
    }

    if (error) {
      return res
        .status(error.statusCode || 400)
        .json({
          ok: false,
          mensaje: error.message
        });
    }

    next();
  });
};