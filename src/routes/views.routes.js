const { Router } = require('express')
const ProductManager = require('../ProductManager')
const pm1 = new ProductManager("../")

const router = Router()


module.exports = router