const express = require('express');
const router = express.Router();

router.get('/titulo/:title', (req, res) => {
    try {
        const trailersData = req.app.locals.trailersData;
        const searchTitle = req.params.title.toLowerCase(); // Convertir a minúsculas para búsqueda case-insensitive
        
        // Filtrar los trailers cuyo título coincida (parcial o completamente)
        const resultados = trailersData.filter(trailer => 
            trailer.titulo.toLowerCase().includes(searchTitle)
        );

        if (resultados.length === 0) {
            return res.status(404).json({ 
                message: 'No se encontraron títulos coincidentes',
                searchTerm: searchTitle
            });
        }

        res.status(200).json({
            count: resultados.length,
            results: resultados
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

module.exports = router;