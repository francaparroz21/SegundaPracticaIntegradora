import * as dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    db: {
        userDB: process.env.USER_DB,
        passDB: process.env.PASS_DB,
        hostDB: process.env.HOST_DB
    },
    jwt: {
        secret: process.env.JWT_SECRET
    },
    github: {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
    }
}

export default config;