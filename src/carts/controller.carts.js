import { Router } from "express";
import CartManager from "../dao/mongoDB/cartManager.mongoDB.js";

const cm = new CartManager();

const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await cm.getCarts();
        res.json(carts);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al acceder a los carritos'});
    }
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cartById = await cm.getCartById(cid);
        if(Object.keys(cartById).length === 0) return res.status(404).json({message: 'Carrito no encontrado'});
        const productsInCart = cartById.products;
        res.json(productsInCart);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al acceder al carrito'});
    }
    
})

router.post('/', async (req, res) => {
    try {   
        const response = await cm.addCart();
        res.status(201).json({message: response});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al crear el carrito'});
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const response = await cm.addProductToCart(cid, pid);
        res.json({message: response});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al agregar el producto al carrito'});
    }
})

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    if(!products) return res.status(400).json({message: 'No se enviaron los datos del producto correctamente'});
    
    try {
        const response = await cm.updateProductsfromCart(cid, products);
        res.json({message: response});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al actualizar los productos'});
    }
})

router.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const response = await cm.updateQuantity(cid, pid, quantity);
        res.json({message: response});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al actualizar el producto'});
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const response = await cm.deleteProductfromCart(cid, pid);
        res.json({message: response});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al eliminar el producto del carrito'});
    }
})

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const response = await cm.deleteProductsfromCart(cid);
        res.json({message: response});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al eliminar los productos del carrito'});
    }
})

export default router;