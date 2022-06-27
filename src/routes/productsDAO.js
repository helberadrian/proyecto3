const mongoose = require('mongoose');
import * as model from "../models/products.js"

class productDao {
    constructor(){
        this.conexion = this.crearConexion()
    }

    async crearConexion(){
        await mongoose.connect('mongodb://localhost:27017/baseprueba');
        console.log("Servidor conectado...");
    }

    async getAll(){
        const productos = await model.find({});
        return productos;
    }

    async createProduct(producto){
        const productoSave = new model(producto);
        await productoSave.save();
    }

    async updateProduct(idProduct, productoNuevo){
        const productUpdate = await model.producto.updateOne({id: idProduct}, {$set: productoNuevo})
        console.log(productUpdate)
    }

    async getProduct(idProduct){
        productos = await model.producto.find({id: idProduct})
        return productos;
    }

    async deleteProduct(idProduct){
        const productoEliminado = await model.producto.deleteOne({id: idProduct});
        console.log(productoEliminado);
    }
}

module.exports = productDao;