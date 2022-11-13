const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const CartSchema = new Schema({
    userId: String,
    uuid: String,
    productos: Array,
    date: String
})
const CartModel = mongoose.model('Carrito', CartSchema)

module.exports = CartModel
