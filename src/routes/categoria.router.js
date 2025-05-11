const express = require('express');
const router = express.Router();

// Endpoint específico para Series
router.get('/categoria/Serie', (req, res) => {
    handleCategory(req, res, 'serie');
});

// Endpoint específico para Películas
router.get('/categoria/pelicula', (req, res) => {
    handleCategory(req, res, 'película');
});

// Función de manejo común
function handleCategory(req, res, category) {
    try {
        const trailersData = req.app.locals.trailersData;
        const resultados = trailersData.filter(trailer => 
            trailer.categoria.toLowerCase() === category
        );

        if (resultados.length === 0) {
            return res.status(404).json({ 
                message: `No se encontraron trailers en la categoría ${category}`,
                searchCategory: category
            });
        }

        res.status(200).json({
            count: resultados.length,
            results: resultados
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            details: error.message 
        });
    }
}

module.exports = router;