const express = require('express');
const router = express.Router();

router.get('/reparto/:actor', (req, res) => {
    try {
        const trailersData = req.app.locals.trailersData;
        const searchActor = req.params.actor.toLowerCase().trim(); 
        
       
        const resultados = trailersData
            .filter(trailer => {
                if (!trailer.reparto) return false;
                
                
                const actores = trailer.reparto.split(',')
                    .map(actor => actor.trim().toLowerCase());
                
                
                return actores.some(actor => 
                    actor.includes(searchActor)
                );
            })
            .map(trailer => {
                
                const actoresFiltrados = trailer.reparto.split(',')
                    .map(actor => actor.trim())
                    .filter(actor => 
                        actor.toLowerCase().includes(searchActor)
                    );
                
                return {
                    titulo: trailer.titulo,
                    reparto: actoresFiltrados.join(', '),
                    poster: trailer.poster
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
