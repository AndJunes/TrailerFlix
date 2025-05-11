const express = require('express');
const fs = require('fs');
const app = express(); 
const router = express.Router();
app.use(express.static('styles')); 
app.use(express.static('img')); 


const paginaInicio = fs.readFileSync('./views/index.html', 'utf-8');


router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(paginaInicio);
});


module.exports = router; 