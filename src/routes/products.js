const express = require(`express`);
const router = express.Router();
const { productsControllers } = require(`../controllers/products`);
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

router.get('/all', productsControllers.getAllProducts);

router.post('/', upload.single('photo'), productsControllers.add);
// router.get('/', protect, productsControllers.getMyProducts);
router.get('/:id', productsControllers.detailById);
router.put('/:id', upload.single('photo'), productsControllers.edit);
router.delete('/:id', productsControllers.delete);

module.exports = router;
