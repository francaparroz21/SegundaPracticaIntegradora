import Product from "./models/products.models.js";

class ProductManager {

    getProducts = async (limit, page, query, sort) => {
        let filter = {};
        query? filter = {category: query} : filter = {};

        const options = {
            limit, 
            page,
            sort: {price: sort}
        }

        try {
            const data = await Product.paginate(filter, options);
            const response = {
                status: "success",
                payload: data.docs,
                totalPages: data.totalPages,
                prevPage: data.prevPage,
                nextPage: data.nextPage,
                page: data.page,
                hasPrevPage: data.hasPrevPage,
                hasNextPage: data.hasNextPage,
                prevLink: `?limit=${limit}&page=${data.prevPage}`,
                nextLink: `?limit=${limit}&page=${data.nextPage}`
            } 
            return response
        } catch (error) {
            console.log(error);
        }
    }

    getProductById = async (idRef) => {
        try {
            const prodByID = await Product.findById(idRef);
            return prodByID ? prodByID : {}
        } catch (error) {
            console.log(error);
            return {}
        }
    }

    getProductsByCode = async (filter) => {
        try {
            const response = await Product.find({code: filter})
            return response
        } catch (error) {
            console.log(error);
        }
    }

    addProduct = async (product) => {
        try {
            await Product.create(product);
            return 'Producto creado'
        } catch (error) {
            console.log(error);
        }
    }

    updateProduct = async (idRef, updates) => {
        try {
            await Product.findByIdAndUpdate(idRef, updates);
            return 'El producto fue actualizado';
        } catch {
            console.log(error);
        }
    }

    deleteProduct = async (idRef) => {
        try {
            await Product.findByIdAndDelete(idRef);
            return 'Producto eliminado'
        } catch (error) {
            console.log(error);
        }
    }

    deleteAllProducts = async () => {
        try {
            await Product.deleteMany();
            return 'Todos los productos fueron eliminados'
        } catch (error) {
            console.log(error);
        }
    }
}

export default ProductManager;