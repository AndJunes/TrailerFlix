const express = require('express');
const router = express.Router();

router.get('/catalogo', (req, res) => {
    try {
        const trailersData = req.app.locals.trailersData;
        res.status(200).json(trailersData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

module.exports = router;