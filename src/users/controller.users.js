import CustomRouter from "../router/CustomRouter.js";
import User from "../dao/mongoDB/models/user.model.js";
import CartManager from "../dao/mongoDB/cartManager.mongoDB.js";
import { createHash } from "../utils/passwordEncryptor.js";

const cm = new CartManager();

class UsersRouter extends CustomRouter {
    init() {

        this.post('/', async (req, res) => {
            const { first_name, last_name, age, email, password } = req.body;

            try {
                const user = await User.findOne({email});

                if(user) return res.sendUserError('Ya existe un usuario con ese correo electrónico');

                const newUserCart = await cm.addCart();
                const { newCart } = newUserCart;
                

                const newUserInfo = {
                    first_name,
                    last_name,
                    age,
                    email,
                    cart: newCart._id,
                    password: createHash(password)
                }
                const newUser = await User.create(newUserInfo);
                return res.sendCreated('Usuario registrado');
            } catch(error) {
                console.log(error);
            }
        })
    }
}

export default UsersRouter;
