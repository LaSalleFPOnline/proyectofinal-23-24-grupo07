const mongoose = require('mongoose')
const Schema = mongoose.Schema
const productSchema = new Schema ({
    title: String,
    actualPrice: Number,
    targetPrice: String,
    image: String,
    url: String,
    userId: String
    
})
module.exports = mongoose.model('products', productSchema)