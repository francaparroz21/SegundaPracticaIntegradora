import { isValidObjectId } from "mongoose";
import Cart from "./models/carts.model.js";
import ProductManager from "./productManager.mongoDB.js";

const pm = new ProductManager();

class CartManager {

    getCarts = async () => {
        try {
            const carts = await Cart.find();
            return carts;
        } catch (error) {
            console.log(error);
        }
    }

    getCartById = async (idRef) => {
        try {
            const cartById = await Cart.findOne({_id: idRef});
            return cartById ? cartById : {};
        } catch (error) {
            console.log(error);
            return {}
        }
    }

    addCart = async () => {
        try {
            const newCart = await Cart.create({products: []});
            return {message: 'Carrito creado', newCart};
        } catch (error) {
            console.log(error);
        }
    }

    addProductToCart = async (cidRef, pidRef) => {
        try {
            const cart = await this.getCartById(cidRef);
            if(!cart) return 'No se encontró el carrito';
            const product = await pm.getProductById(pidRef);
            if(Object.keys(product).length === 0) return 'Producto no encontrado en la base de datos';

            const prodIndex = cart.products.findIndex(prod => prod.product.equals(product._id));
            
            if(prodIndex !== -1) {
                cart.products[prodIndex].quantity ++;
                await Cart.updateOne({_id: cidRef}, cart);
                return 'Producto actualizado';
            } else {
                cart.products.push({product: pidRef, quantity: 1});
                await Cart.updateOne({_id: cidRef}, cart);
                return 'Producto agregado al carrito';
            }
        } catch (error) {
            console.log(error);
        }
    }

    updateProductsfromCart = async (cidRef, products) => {
        try {
            const cart = await this.getCartById(cidRef);
            if(!cart) return 'No se encontró el carrito';

            let updateIsValid = true;
            
            await products.forEach(async prod => {
                let id = prod.product._id;
                const validId = isValidObjectId(id);
                if(validId) {
                    try {
                        const response = await pm.getProductById(id);
                        if(Object.keys(response).length === 0) updateIsValid = false;
                    } catch (error) {
                         console.log(error);
                    }
                } else {
                    updateIsValid = false;
                }
                
            });
            
            if(updateIsValid) {
                cart.products = products;
                await Cart.updateOne({_id: cidRef}, cart);
                return 'Productos actualizados';
            } else {
                return 'Error al ingresar los productos'
            }   
        } catch (error) {
            console.log(error);
        }
    }

    updateQuantity = async (cidRef, pidRef, update) => {
        try {
            const cart = await this.getCartById(cidRef);
            if(!cart) return 'No se encontró el carrito';

            if(cart.products.length === 0) return 'El carrito no tiene productos';

            const prodIndex = cart.products.findIndex(prod => prod.product.equals(pidRef));
            if(prodIndex === -1) return 'El producto no se encontró en el carrito';

            cart.products[prodIndex].quantity = update;
            await Cart.updateOne({_id: cidRef}, cart);
            return 'Producto actualizado';
        } catch (error) {
            console.log(error);
        }
    }

    deleteProductfromCart = async (cidRef, pidRef) => {
        try {
            const cart = await this.getCartById(cidRef);
            if(!cart) return 'No se encontró el carrito';

            if(cart.products.length === 0) return 'El carrito no tiene productos';

            const prodIndex = cart.products.findIndex(prod => prod.product.equals(pidRef));
            if(prodIndex === -1) return 'El producto no se encontró en el carrito';

            cart.products.splice(prodIndex, 1);
            await Cart.updateOne({_id: cidRef}, cart);
            return 'Producto eliminado del carrito'
        } catch (error) {
            console.log(error);
        }
    }

    deleteProductsfromCart = async (cidRef) => {
        try {
            const cart = await this.getCartById(cidRef);
            if(!cart) return 'No se encontró el carrito';

            if(cart.products.length === 0) return 'El carrito no tiene productos';

            cart.products = [];
            await Cart.updateOne({_id: cidRef}, cart);
            return 'Productos eliminados del carrito'
        } catch (error) {
            console.log(error);
        }
    }
}

export default CartManager;
