const express = require('express');
const router = express.Router();
const passport = require('passport');

const sms = require('../message/sms');
const whatsapp = require('../message/whatsapp');
const email = require('../message/email');

let file = "./data/data.json";
let file_carrito = "./data/carrito.json";

const DAO = require("productsDao");
const producto = new DAO;

// ....::Home::....
router.get('/', (req, res, next) => {
    res.render('index');
});

// ....::Products CRUD::....
router.get("/productos", (req, res) => { // GET
    res.json(producto.getAll());
});

router.get("/productos/:id", (req, res) =>{ // GET ID
    const id = parseInt(req.params.id);
    res.json(producto.getProduct(id));
});
    
router.post("/productos", (req, res) => { // POST
    const productoNuevo = req.body;
    producto.createProduct(productoNuevo)
    res.render("index");
});

router.put("/productos/:id", (req, res) =>{ // PUT
    const id = parseInt(req.params.id);
    const productoNuevo = req.body;

    producto.updateProduct(id, productoNuevo);
    res.render("index");
});

router.delete("/productos/:id", (req, res) =>{ // DELETE
    const id = parseInt(req.params.id);
    producto.deleteProduct(id);
    res.render("index");
});

// ....::Carrito CRUD::....
router.get("/carrito/:id/productos", (req, res) =>{ // GET ID
    const id = parseInt(req.params.id);

    fs.promises.readFile(file_carrito, "utf-8")
    .then(contenido => {
        const carritos = JSON.parse(contenido);

        for (const element of carritos) {
            if (element.id == id){
                res.send(`Los productos del carrito son: ${JSON.stringify(element.carrito)}`);
            }
        } 
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});

router.post("/carrito", (req, res) => { // POST
    const nuevo_carrito = [];
    const imprimir = [];

    fs.promises.readFile(file_carrito, "utf-8")
    .then(contenido => {
        const productos = JSON.parse(contenido);

        let n = productos.length;
        console.log(n);
        n += 1;
        imprimir.push({id: n, carrito: nuevo_carrito})
        console.log(imprimir);

        fs.writeFileSync(file_carrito, JSON.stringify(imprimir));
        res.send(`Se creo un nuevo carrito con la id: ${n}`);
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});

router.post("/carrito/:id/productos", (req, res) => { // POST ID
    const id = parseInt(req.params.id);
    const producto = [];

    fs.promises.readFile(file, "utf-8")
    .then(contenido => {
        const data = JSON.parse(contenido);
        producto = data.find(producto => producto.id == id);
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });


    fs.promises.readFile(file_carrito, "utf-8")
    .then(contenido => {
        const carritos = JSON.parse(contenido);

        producto.forEach(element => {
            const producto_nuevo = {id: element.id, nombre: element.nombre, codigo: element.codigo, precio: element.precio, stock: element.stock};
            let n = carritos.length;
            const filtrados = carritos.filter(carrito => carrito.id != n);

            for (const index of carritos) {
                if (index.id == n){
                    index.carrito.push(producto_nuevo);
                    filtrados.push({id: n, carrito: index.carrito});
                    fs.writeFileSync(file_carrito, JSON.stringify(filtrados));
                }
            }
            res.send(`Se agrego el producto ${producto_nuevo} al carrito de ID: ${n}`);
        });
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});

router.delete("/carrito/:id", (req, res) => { // DELETE CARRITO
    const id = parseInt(req.params.id);

    fs.promises.readFile(file_carrito, "utf-8")
    .then(contenido => {
        const carritos = JSON.parse(contenido);
        const filtrados = carritos.filter(carrito => carrito.id != id);

        fs.writeFileSync(file_carrito, JSON.stringify(filtrados));
        res.send(`Se ha eliminado el carrito con ID: ${id}`);
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});

router.delete("/carrito/:id/productos/:id_prod", (req, res) => { // DELETE PRODUCTO DEL CARRITO
    const id = parseInt(req.params.id);
    const id_prod = parseInt(req.params.id_prod);

    fs.promises.readFile(file_carrito, "utf-8")
    .then(contenido => {
        const carritos = JSON.parse(contenido);
        const filtrados = carritos.filter(carrito => carrito.id != id);

        for (const index of carritos) {
            if (index.id == id){
                const productos = index.carrito;
                const extraidos = productos.filter(producto => producto.id != id_prod);

                filtrados.push({id: id, carrito: extraidos});
                fs.writeFileSync(file_carrito, JSON.stringify(filtrados));
                res.send(`Eliminado el producto con ID: ${id_prod} del carrito ID: ${id}`);
            }
        }
    })
    .catch( error => {
        console.log("Error en la lectura", error);
    });
});

router.post("/carrito/compra/", (req, res) => {
    const datos = req.params.body
    try {
        email.compraMail();
        sms.envioSMS();
    } catch (error){
        console.log(error);
    }
});

// ....::Login CRUD::....
router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}), (req, res, next) => {
    const datos = req.params.body
    try {
        email.registroMail(datos);
    } catch (error){
        console.log(error);
    }
});

router.get('/signin', (req, res, next) => {
    res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
}));

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.get('/profile', isAuthenticated, (req, res, next) => {
    res.render('profile');
});

// middlewares
function isAuthenticated(req, res, next) { // para verificar si esta autenticado antes de acceder a una ruta
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/');
};

module.exports = router;