import productsController from "../products/controller.products.js";
import cartsController from "../carts/controller.carts.js";

import UsersRouter from "../users/controller.users.js";
import AuthRouter from "../auth/controller.auth.js";
import ViewsRouter from "../views/controller.views.js";

const usersRouter = new UsersRouter();
const authRouter = new AuthRouter();
const viewsRouter = new ViewsRouter();

const router = (app) => {
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('/api/users', usersRouter.getRouter());
    app.use('/api/auth', authRouter.getRouter());
    app.use('/', viewsRouter.getRouter());
}

export default router;