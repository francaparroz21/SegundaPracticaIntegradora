import { Router } from "express";
import passport from "passport";

class CustomRouter {
    constructor () {
        this.router = Router();
        this.init();
    }

    getRouter = () => {
        return this.router;
    }

    init(){}

    get = (path, policies, ...callbacks) => {
        this.router.get(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        );
    }

    post = (path, ...callbacks) => {
        this.router.post(
            path, 
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        );
    }

    applyCallbacks = (callbacks) => {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch(error) {
                console.log(error);
                params[1].status(500).json({error});

            }
        })
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.json({status: 'Success', message: payload});
        res.sendCreated = payload => res.status(201).json({status: 'Success', message: payload});
        res.sendServererror = error => res.status(500).json({status: 'Error', error});
        res.sendUserError = error => res.status(400).json({status: 'Error', error});
        next();
    }

    handlePolicies = (policies) => {
        if(policies.includes('PUBLIC')) {
            return (req, res, next) => {
                next();
            };
        }
        return async (req, res, next) => {
            passport.authenticate('jwt', function(err, user, info) {
                if(err) return next(err);

                if(!user) {
                    return res.status(401).json({error: info.messages ? info.messages : info.toString()});
                }
            
                if(!policies.includes(user.user.role.toUpperCase())) {
                    return res.status(403).json({error: 'Not authorized'});
                }

                req.user = user;
                next();
            }) (req, res, next);

        } 
    };
}

export default CustomRouter;