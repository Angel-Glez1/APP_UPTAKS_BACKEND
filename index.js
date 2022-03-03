const express = require('express');

const app = express();


app.get('/', (req, res) => {

    res.json({ ok: true, msg: 'Hola' });
})


app.listen(9000, () => console.log('Aplicacion corriendo en el puerto 9000'));