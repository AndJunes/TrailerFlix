const express = require('express');
const router = express.Router();

router.get('/trailer/:id', (req, res) => {
    try {
        const trailersData = req.app.locals.trailersData;
        const searchId = parseInt(req.params.id); 
        
        
        const resultado = trailersData.find(trailer => 
            trailer.id === searchId
        );

        if (!resultado) {
            return res.status(404).json({ 
                message: 'No se encontró ningún trailer con este ID',
                searchId: searchId
            });
        }

        
        const respuesta = {
            id: resultado.id,
            titulo: resultado.titulo,
            trailer: resultado.trailer || null 
        };

        res.status(200).json(respuesta);
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

module.exports = router;
