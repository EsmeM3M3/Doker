const express = require('express'); // Framework para construir el servidor web
const mongoose = require('mongoose'); // Biblioteca para manejar MongoDB
const cors = require('cors'); // Middleware para habilitar CORS
const path = require('path'); // Para manejar rutas de archivos estáticos

// Crear una instancia de Express
const app = express();

// Middleware
app.use(express.json()); // Para procesar datos JSON enviados en el cuerpo de las solicitudes
app.use(cors()); // Para permitir solicitudes desde otros orígenes

// Servir archivos estáticos (index.html y otros archivos)
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a la base de datos de MongoDB
mongoose.connect('mongodb://localhost:27017/testDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexión a MongoDB exitosa');
}).catch(err => {
    console.error('Error al conectar a MongoDB:', err);
});

// Definir un modelo para los datos
const Data = mongoose.model('Data', new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true }
}));

// Ruta para manejar la inserción de datos (POST)
app.post('/api/data', async (req, res) => {
    try {
        const { name, value } = req.body;
        const newData = new Data({ name, value });
        await newData.save();
        res.status(201).send(newData);
    } catch (error) {
        res.status(500).send({ error: 'Error al guardar los datos' });
    }
});

// Ruta para obtener los datos (GET)
app.get('/api/data', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener los datos' });
    }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
