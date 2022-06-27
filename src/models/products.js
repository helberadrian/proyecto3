const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const producto = new Schema({
    nombre: {type: String, require: true},
    descripcion: {type: String, require: true},
    foto: {type: String, require: true},
    precio: {type: Number, require: true},
    stock: {type: Number, require: true},
});

module.exports = mongoose.model("producto", producto);