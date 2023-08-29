import CustomRouter from "../router/CustomRouter.js";
import ProductManager from "../dao/mongoDB/productManager.mongoDB.js";
import CartManager from "../dao/mongoDB/cartManager.mongoDB.js";

const pm = new ProductManager();
const cm = new CartManager();


class ViewsRouter extends CustomRouter {
    init() {

        this.get('/', ['PUBLIC'], (req, res) => {
            res.redirect('/products')
        });
        
        this.get('/signup', ['PUBLIC'], (req, res) => {
            res.render('signup', {
                style: 'signup.css'
            })
        });
        
        this.get('/login', ['PUBLIC'], (req, res) => {
            res.render('login', {
                style: 'login.css'
            })
        });
        
        this.get('/profile', ['USER'], (req, res) => {
            const user = req.user.user;
            console.log('controller', user)
            res.render('profile', {
                user,
                style: 'profile.css'
            })
        });
        
        this.get('/products', ['USER'], async (req, res) => {
            const user = req.user.user;
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page)  || 1; 
            const query = req.query.query || null;
            const sort = req.query.sort || null;
            let showProducts = false;
            let products = [] 
        
            try {
                const response = await pm.getProducts(limit, page, query, sort);
                products = response.payload;
        
                products.length > 0 ? showProducts = true : showProducts = false;
                res.render('products', {
                    user,
                    showProducts,
                    products: products.map(prod => prod.toJSON()),
                    prevPageLink: response.hasPrevPage? response.prevLink : "",
                    nextPageLink: response.hasNextPage? response.nextLink : "",
                    style: 'products.css'
                });
            } catch (error) {
                console.log(error)
                res.status(500).render('products', {
                    showProducts,
                    style: 'products.css'
                });
            }
        })
        
        this.get('/products/details/:pid', ['USER'], async (req, res) => {
            const { pid } = req.params;
            let showProduct = false;
            let product = {}
        
            try {
                product = await pm.getProductById(pid);
                product === {} ? showProduct = false : showProduct = true
                const { thumbnail, name, description, category, price, stock } = product;
        
                res.render('details', {
                    showProduct,
                    thumbnail,
                    name,
                    description,
                    category,
                    price,
                    stock,
                    style: 'details.css'
                })
        
            } catch (error) {
                console.log(error);
                res.status(500).render('details', {
                    showProduct,
                    style: 'details.css'
                })
            }
        })
        
        this.get ('/carts/:cid', ['USER'], async (req, res) => {
            const { cid } = req.params;
            let showProducts = false;
        
            try {
                const cart = await cm.getCartById(cid);
                const products = cart.products;
                products.length > 0 ? showProducts = true : showProducts = false;
            
                res.render('cart', {
                    showProducts,
                    products: products.map(prod => prod.toJSON()),
                    style: 'cart.css'
                }) 
            } catch (error) {
                console.log(error) 
                res.status(500).render('cart', {
                    showProducts,
                    style: 'cart.css'
                })
            }
        })
    }
}

export default ViewsRouter;