const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config()

const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))

app.use(session({
  secret: process.env.JWT_SECRET, 
  resave: false,
  saveUninitialized: true
}));

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');

app.use(cookieParser());

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));
  
const products = require('./routes/productsRoutes')
app.use(products)


app.get('/', (req, res)=>{
    res.send('hola mundo')
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`¡Server UP! en http://localhost:${PORT}`)
})