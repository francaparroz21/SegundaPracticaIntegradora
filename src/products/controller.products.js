import { Router } from "express";
import ProductManager from "../dao/mongoDB/productManager.mongoDB.js";
import { uploader } from "../utils/multer.js";

const pm = new ProductManager();

const router = Router();

router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page)  || 1; 
    const query = req.query.query || "";
    const sort = req.query.sort || "";

    const sortLowercase = sort.toLowerCase();
    
    try {
        const products = await pm.getProducts(limit, page, query, sortLowercase);
        return res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al acceder a los productos'});
    }
})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params

    try {
        const productById = await pm.getProductById(pid);
        if(Object.keys(productById).length === 0) return res.status(404).json({message: 'Producto no encontrado'});
        res.json(productById);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al acceder a los productos'});
    }
})

router.post('/', uploader.single('file'), async (req, res) => {
    const { name, description, category, code, price, thumbnail=[], stock } = req.body;
    if(!name || !description || !category || !code || !price || !stock) return res.status(400).json({message: 'Error en el ingreso de los campos'});

    const products = await pm.getProductsByCode(code);
    if(products.length !== 0) return res.status(500).json({message: 'El producto ya se encuentra ingresado en la base de datos'}); 
    
    const imgPath = req.file?.filename;
    const relativePath = `/img/${imgPath}`;
    thumbnail.push(relativePath);

    const newProduct = {
        name,
        description,
        category,
        code,
        price,
        thumbnail,
        stock
    }

    try {
        const response = await pm.addProduct(newProduct);
        res.status(201).json({message: response });
    } catch (error) {
        res.status(500).json({message: 'Error al ingresar el producto'});
    }
})

router.patch('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { name, description, category, code, price, thumbnail, stock } = req.body;

    const updates = {
        name, 
        description, 
        category, 
        code, 
        price, 
        thumbnail, 
        stock
    }

    try {
        const product = await pm.getProductById(pid);
        if(Object.keys(product).length === 0) return res.status(404).json({message: 'Producto no encontrado'});

        Object.keys(updates).forEach(key => {
            if(updates[key] && updates[key] !== product[key]) product[key] = updates[key];
        })

        const response = await pm.updateProduct(pid, product);
        res.json({message: response});
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar el producto'});
    }
})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const response = await pm.deleteProduct(pid);
        res.json({message: response});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar el producto'}) 
    }
})

export default router;