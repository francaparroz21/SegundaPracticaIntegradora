import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const jwtSecret = config.jwt.secret;

const generateToken = user => {
    const token = jwt.sign({ user }, jwtSecret, {expiresIn: '15m'});
    return token;
};

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({error: 'Usuario no autenticado'});
    const token = authHeader.split(' ')[1];

    jwt.verify(token, jwtSecret, (error, credentials) => {
        if(error) return res.status(403).json({error: 'Usuario no autorizado'});
    });

    req.user = credentials.user;

    next();
}

export { generateToken, authToken };