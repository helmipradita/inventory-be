const express = require('express');
const router = express.Router();
const productsControllers = require('../routes/products');
const usersControllers = require('../routes/users');

router.use('/products', productsControllers);
router.use('/users', usersControllers);

module.exports = router;
