const axios = require('axios');
const Product = require('../model/Product')

//Crear
async function create (req, res) {
    try {
        // Obenter usuario
        const userId = req.session.userId;
        if (!userId) {
            throw new Error('No se pudo obtener el ID del usuario');
        }
        //Solicitud api
        const url = req.body.url;
        const response = await axios.get(`http://127.0.0.1:5000/track?url=${url}`);
        //Repuesta= imagen: url... precio: 19,99 titulo: Producto...

        // Verificar si response.data.results está definido
        if (!response.data) {
            throw new Error('No se pudo obtener los datos del producto desde la API');
        }

        // Recoger los campos de la respuesta de la API
        const { imagen, precio, titulo } = response.data;

        // Convertir el precio de texto a número
        const actualPrice = parseFloat(precio.replace(',', '.')); // Reemplazar ',' con '.'
        

        // Creamos una nueva instancia del modelo Product con los datos del cuerpo de la solicitud
        const product = new Product({
            title: titulo,
            targetPrice: req.body.targetPrice,
            actualPrice: actualPrice,
            image: imagen,
            url: req.body.url,
            userId: userId
        });

        // Guardamos el producto en la base de datos utilizando una promesa
        const nuevoProducto = await product.save();

        // Redirigimos al usuario a la página principal después de crear el producto
        res.redirect('/');
    } catch (error) {
        // Manejamos cualquier error que pueda ocurrir durante el proceso
        console.error(error);
        res.status(500).json({
            message: 'Error al crear el Producto'
        });
    }
};

//Mostrar
async function readAll (req, res) {
    try {
        const userId = req.session.userId;
        if (!userId) {
            res.redirect('/login');
            console.error('No se pudo obtener el ID del usuario');
        }

        // Busca productos del user actual
        const productos = await Product.find({ userId: userId });
        res.render('index', { productos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error mostrando los productos' });
    }
}

//Editar
async function update(req, res) {
    try {
        const id = req.body.id_editar;
        const title_editar = req.body.title_editar;
        const price_editar = req.body.price_editar;

        // Utiliza findByIdAndUpdate con promesas
        await Product.findByIdAndUpdate(id, { targetPrice: price_editar, title: title_editar});

        // Redirige al usuario a la página principal después de actualizar el producto
        res.redirect('/');
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante el proceso
        console.error(error);
        res.status(500).json({
            message: 'Error actualizando el Producto'
        });
    }
}


//Borrar
async function remove (req, res) {
    const { id } = req.params;

    try {
      // Buscar y eliminar la pregunta por su ID en la base de datos
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
        return res.status(500).json({
            message: 'Error eliminando el Producto'
        })
    }
    res.redirect('/')
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting question');
  }
}

module.exports = { create, readAll, update, remove}