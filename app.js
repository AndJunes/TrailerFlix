require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Asegurar ruta completa

// Configurar archivos estáticos (una sola configuración principal)
app.use(express.static(path.join(__dirname, 'views')));

// Configuraciones adicionales para rutas específicas (opcional)
app.use('/styles', express.static(path.join(__dirname, 'views', 'styles')));
app.use('/posters', express.static(path.join(__dirname, 'views', 'posters')));
app.use('/img', express.static(path.join(__dirname, 'views', 'img')));
app.use('/scripts', express.static(path.join(__dirname, 'views', 'scripts')));

// Resto de tu configuración...
const dataPath = path.join(__dirname, 'database', process.env.DATA_FILE);
let trailersData;
try {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    trailersData = JSON.parse(rawData);
    console.log('✅ Datos cargados correctamente');
} catch (error) {
    console.error('❌ Error al cargar el archivo JSON:', error.message);
    process.exit(1); 
}
app.locals.trailersData = trailersData;

// Rutas
const mainRouter = require('./src/routes/main.router');
app.use(mainRouter);

const catalogoRouter = require('./src/routes/catalogo.router');
app.use(catalogoRouter);

const tituloRouter = require('./src/routes/titulo.router');
app.use(tituloRouter);

const categoriaRouter = require('./src/routes/categoria.router');
app.use(categoriaRouter);

const repartoRouter = require('./src/routes/reparto.router');
app.use(repartoRouter);

const trailerRouter = require('./src/routes/trailer.router');
app.use(trailerRouter);

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});