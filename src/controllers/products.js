const { response } = require(`../middleware/common`);
const {
  selectAllProducts,
  countAll,
  insertProducts,
  selectRecipes,
  selectDetailProducts,
  updateProducts,
  deleteProducts,
} = require(`../models/products`);
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('../config/photo');

const productsControllers = {
  getAllProducts: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 12;
      const sortBy = req.query.sortBy || 'updated_at';
      const sortOrder = req.query.sortOrder || 'ASC';
      const search = req.query.search || '';
      const offset = page * limit;

      const result = await selectAllProducts({
        search,
        sortBy,
        sortOrder,
        limit,
        offset,
      });

      const {
        rows: [count],
      } = await countAll();
      const totalRows = parseInt(count.total);
      const totalPage = Math.ceil(totalRows / limit);
      const pagination = {
        page: page,
        limit,
        totalRows,
        totalPage,
      };

      response(res, 200, true, result.rows, 'get products success', pagination);
    } catch (error) {
      console.log(error);
      response(res, 404, false, null, ' get products failed');
    }
  },
  add: async (req, res, next) => {
    try {
      const { name, buying_price, selling_price, stock } = req.body;
      // const user_id = req.payload.id;

      const dataProduct = {
        id: uuidv4(),
        name,
        buying_price,
        selling_price,
        stock,
      };

      if (req.file) {
        const image = await cloudinary.uploader.upload(req.file.path, {
          folder: 'inventory-nutech',
        });

        dataProduct.photo = image.url;
      } else {
        return response(
          res,
          404,
          false,
          [],
          'insert products failed, photo empty!'
        );
      }

      await insertProducts(dataProduct);
      response(res, 200, true, dataProduct, 'insert recipe success');
    } catch (error) {
      console.log(error);
      response(res, 404, false, 'insert recipe failed');
    }
  },
  getMyRecipe: async (req, res, next) => {
    try {
      const { id } = req.payload;

      const recipes = await selectRecipes(id);

      if (!recipes) {
        return response(res, 404, false, [], 'recipes not found');
      }

      response(res, 200, true, recipes.rows, 'get data recipes success');
    } catch (error) {
      response(res, 404, false, null, ' get data recipes failed');
    }
  },
  detailById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const {
        rows: [products],
      } = await selectDetailProducts(id);

      if (!products) {
        return response(res, 404, false, [], 'products not found');
      }

      response(res, 200, true, products, 'get data products success');
    } catch (error) {
      response(res, 404, false, null, ' get data products failed');
    }
  },
  edit: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, buying_price, selling_price, stock } = req.body;

      const {
        rows: [products],
      } = await selectDetailProducts(id);

      if (!products) {
        return response(res, 404, false, [], 'products not found');
      }

      const dataProduct = {
        id,
        name,
        buying_price,
        selling_price,
        stock,
      };

      if (req.file) {
        const image = await cloudinary.uploader.upload(req.file.path, {
          folder: 'inventory-nutech',
        });

        dataProduct.photo = image.url;
      } else {
        dataProduct.photo = products.photo;
      }

      await updateProducts(dataProduct);
      response(res, 200, true, dataProduct, 'Edit products success');
    } catch (error) {
      console.log(error);
      response(res, 404, false, 'Edit products failed');
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      deleteProducts(id);
      response(res, 200, true, deleteProducts, 'delete products success');
    } catch (error) {
      console.log(error);
      response(res, 404, false, 'delete products failed');
    }
  },
};

exports.productsControllers = productsControllers;
