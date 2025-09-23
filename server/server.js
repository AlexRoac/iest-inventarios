const http = require('http');
const fs = require('fs');
const url = require('url');
const express = require('express');
const multer = require('multer');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const bodyParser = require('body-parser');
require('dotenv').config();
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// ✅ Configuración CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? [
          `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'tu-app.onrender.com'}`,
          'http://localhost:3000'
        ] 
      : ['http://localhost:3000'];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Configuración de base de datos
const poolConfig = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
} : {
  host: 'localhost',
  database: 'iestInventarios',
  user: 'postgres',
  password: 'mundo131626%',
  max: 5,
  connectionTimeoutMillis: 20000
};
const pool = new Pool(poolConfig);

app.use(session({
  secret: process.env.SESSION_SECRET || 'placeholdersecret',
  resave: false,
  saveUninitialized: false,
  store: new pgSession({
    pool: pool,
    createTableIfMissing: true,
    tableName: 'session'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// ✅ Configurar multer
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg','image/png','image/gif','image/webp','application/pdf'
  ];
  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Tipo de archivo no permitido'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// ✅ Servir archivos estáticos
app.use('/uploads', express.static(uploadsDir));

// ✅ Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/build');
  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    console.log('✅ Frontend servido desde:', clientBuildPath);
  } else {
    console.log('⚠️ No se encontró la carpeta build del frontend');
  }
}

// ✅ Función para URLs dinámicas
const getFileUrl = (req, filename) => {
  if (process.env.NODE_ENV === 'production') {
    return `https://${req.get('host')}/uploads/${filename}`;
  } else {
    return `http://localhost:${port}/uploads/${filename}`;
  }
};

// ✅ Logger
const log = (message, data = null) => {
  if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
    if (data) console.log(`[${new Date().toISOString()}] ${message}`, data);
    else console.log(`[${new Date().toISOString()}] ${message}`);
  }
};

// ================== ENDPOINTS ==================

// Login
app.post('/login', async (req, res) => {
  const { idInput, passwordInput } = req.body;
  log('Intento de login recibido:', { idInput });

  try {
    const userExists = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1', 
      [idInput]
    );
    if (userExists.rows.length === 0) {
      log('Usuario no encontrado:', idInput);
      return res.status(401).json({ message: 'ID o contraseña incorrectos' });
    }
    const user = userExists.rows[0];
    const validPassword = await bcrypt.compare(passwordInput, user.password);
    if (!validPassword) {
      log('Contraseña incorrecta para usuario:', idInput);
      return res.status(401).json({ message: 'ID o contraseña incorrectos' });
    }
    req.session.user = { userId: user.id, userType: user.tipo };
    req.session.isAuth = true;
    log('Sesión creada para usuario:', user.id);
    res.status(200).json({ redirectTo: '/home', message: '¡Bienvenido!' });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Error al cerrar sesión' });
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Sesión cerrada' });
  });
});

// Info usuario
app.get('/user-info', (req, res) => {
  if (req.session.user) {
    res.json({ 
      userType: req.session.user.userType, 
      userId: req.session.user.userId 
    });
  } else {
    res.status(401).json({ message: 'No autenticado' });
  }
});

// Registro
app.post('/register', async (req, res) => {
  const { id, tipo, password } = req.body;
  try {
    const userExists = await pool.query(
      'SELECT id FROM usuarios WHERE id = $1', [id]
    );
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'El ID ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO usuarios (id, tipo, password) VALUES ($1, $2, $3)',
      [id, tipo, hashedPassword]
    );
    res.status(201).json({ message: 'Registro exitoso' });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Cargar inventario
app.get('/cargarInventario', async(req, res) => {
  const { area } = req.query;
  try{
    let articulosArea = await pool.query(
      "SELECT * FROM articulos WHERE area = $1", [area]
    );
    res.json(articulosArea.rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data from database"});
  }
});

// Update
app.post('/updateChanges', async(req, res) => {
  const {rowIndex, colName, newValue} = req.body;
  try{
    const result = await pool.query(`UPDATE articulos SET ${colName} = $1 WHERE id = $2`, [newValue, rowIndex])
    if (result.rowCount > 0) {
      res.status(200).json({ status: 'success', message: 'Data updated successfully' });
    } else {
      res.status(404).json({ status: 'error', message: 'No matching record found to update' });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error updating data', error: err.message });
  }
});

// Add item
app.post('/addItem', upload.fields([
  { name: 'ruta_img', maxCount: 1 },
  { name: 'ruta_pdf_instructivo', maxCount: 1 },
  { name: 'ruta_img_instructivo', maxCount: 1 },
  { name: 'ruta_pdf_seguridad', maxCount: 1 },
  { name: 'ruta_img_seguridad', maxCount: 1 }
]), async (req, res) => {
  const { area, nombre, cant, capRecipiente } = req.body;
  const ruta_img = req.files.ruta_img ? getFileUrl(req, req.files.ruta_img[0].filename) : null;
  const ruta_pdf_instructivo = req.files.ruta_pdf_instructivo ? getFileUrl(req, req.files.ruta_pdf_instructivo[0].filename) : null;
  const ruta_img_instructivo = req.files.ruta_img_instructivo?.[0] ? getFileUrl(req, req.files.ruta_img_instructivo[0].filename) : null;
  const ruta_pdf_seguridad = req.files.ruta_pdf_seguridad ? getFileUrl(req, req.files.ruta_pdf_seguridad[0].filename) : null;
  const ruta_img_seguridad = req.files.ruta_img_seguridad?.[0] ? getFileUrl(req, req.files.ruta_img_seguridad[0].filename) : null;
  let cant_vol = cant * capRecipiente;
  try {
    const result = await pool.query(
      `INSERT INTO articulos 
        (area, nombre, cant, cant_vol, ruta_img, ruta_pdf_instructivo, ruta_img_instructivo, ruta_pdf_seguridad, ruta_img_seguridad)
       VALUES 
        ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [area, nombre, cant, cant_vol, ruta_img, ruta_pdf_instructivo, ruta_img_instructivo, ruta_pdf_seguridad, ruta_img_seguridad]
    );
    res.status(201).json({ message: 'Artículo agregado exitosamente', articulo: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar artículo', error: error.message });
  }
});

// Upload thumbnail
app.post('/upload-thumbnail', upload.single('thumbnail'), (req, res) => {
  res.json({ path: getFileUrl(req, req.file.filename), filename: req.file.filename });
});

// Upload pdf
app.post('/upload-pdf', upload.single('pdf'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ path: getFileUrl(req, req.file.filename), filename: req.file.filename });
});

// Delete items
app.post('/deleteItems', async (req, res) => {
  const { ids } = req.body;
  try{
    for(const id of ids) {
      await pool.query("DELETE FROM articulos WHERE id = $1", [id]);
    }
    res.status(200).json({ message: 'Artículos borrados exitosamente'});
  } catch (error) {
    res.status(500).json({ error: "Error deleting data from database"});
  }
});

// Contar artículos
app.get('/contarArticulos', async(req, res) => {
  try {
    const nServiciosGenerales = await pool.query("SELECT COUNT(*) FROM articulos WHERE area = 'serviciosGenerales'");
    const nMedicina = await pool.query("SELECT COUNT(*) FROM articulos WHERE area = 'medicina'");
    const nGastronomia = await pool.query("SELECT COUNT(*) FROM articulos WHERE area = 'gastronomia'");
    const nCafeteria = await pool.query("SELECT COUNT(*) FROM articulos WHERE area = 'cafeteria'");
    const nTotal = await pool.query("SELECT COUNT(*) FROM articulos");
    res.json({
      serviciosGenerales: nServiciosGenerales.rows[0].count,
      medicina: nMedicina.rows[0].count,
      gastronomia: nGastronomia.rows[0].count,
      cafeteria: nCafeteria.rows[0].count,
      total: nTotal.rows[0].count
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// ✅ Fallbacks de rutas
if (process.env.NODE_ENV === 'production') {
  // En producción → SPA fallback
  app.get('*', (req, res) => {
    const clientBuildPath = path.join(__dirname, '../client/build/index.html');
    if (fs.existsSync(clientBuildPath)) {
      res.sendFile(clientBuildPath);
    } else {
      res.status(404).json({ 
        message: 'Frontend not built yet',
        hint: 'Run npm run build en la carpeta client'
      });
    }
  });
} else {
  // En desarrollo → JSON 404
  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });
}

// Errores globales
process.on('uncaughtException', function (err) {
  console.error('Excepción no capturada:', err);
});

// Iniciar servidor
app.listen(port, () => {
  console.log(` Servidor escuchando en puerto ${port}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Frontend servido desde el backend');
    console.log(`Uploads directory: ${uploadsDir}`);
  }
});

module.exports = app;
