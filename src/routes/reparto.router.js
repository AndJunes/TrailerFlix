const express = require('express');
const router = express.Router();

router.get('/reparto/:actor', (req, res) => {
    try {
        const trailersData = req.app.locals.trailersData;
        const searchActor = req.params.actor.toLowerCase().trim(); // Get and clean the search term
        
        // Filter and map the results
        const resultados = trailersData
            .filter(trailer => {
                if (!trailer.reparto) return false;
                
                // Split the comma-separated string and clean each actor name
                const actores = trailer.reparto.split(',')
                    .map(actor => actor.trim().toLowerCase());
                
                // Check if any actor matches the search
                return actores.some(actor => 
                    actor.includes(searchActor)
                );
            })
            .map(trailer => {
                // Split and filter to only show matching actors
                const actoresFiltrados = trailer.reparto.split(',')
                    .map(actor => actor.trim())
                    .filter(actor => 
                        actor.toLowerCase().includes(searchActor)
                    );
                
                return {
                    titulo: trailer.titulo,
                    reparto: actoresFiltrados.join(', '), // Join back to string
                    poster: trailer.poster // Optional: include poster
                };
            });

        if (resultados.length === 0) {
            return res.status(404).json({ 
                message: 'No se encontraron trailers con este actor',
                searchActor: searchActor
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