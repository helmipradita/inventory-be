const Pool = require(`../config/db`);

const selectAllProducts = ({ limit, offset, sortBy, sortOrder, search }) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT 
        products.id, products.name, products.buying_price, products.selling_price, 
        products.stock, products.photo,
        to_char( products.created_at, 'day, DD Mon YYYY, HH24:MI' ) AS created_at, 
        to_char( products.updated_at, 'day, DD Mon YYYY, HH24:MI' ) AS updated_at
      FROM products AS products
      WHERE products.name 
      ILIKE '%${search}%' ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ${limit} OFFSET ${offset}`,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    )
  );
};

const countAll = () => {
  return Pool.query('SELECT COUNT(*) AS total FROM products');
};

const insertProducts = (data) => {
  const { id, name, buying_price, selling_price, stock, photo } = data;
  return new Promise((resolve, reject) =>
    Pool.query(
      `INSERT INTO products
        (id, name,  buying_price, selling_price, stock, 
          photo, created_at, updated_at) 
      VALUES('${id}', '${name}', '${buying_price}', '${selling_price}', '${stock}', 
        '${photo}', NOW(), NOW())`,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    )
  );
};

const selectRecipes = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT recipes.id, recipes.title, recipes.ingredients, recipes.photo, 
        recipes.videos, recipes.user_id, users.name AS author,
        to_char( recipes.created_at, 'day, DD Month YYYY' ) AS created_at, 
        to_char( recipes.updated_at, 'day, DD Month YYYY' ) AS updated_at
      FROM recipes AS recipes
      INNER JOIN users AS users ON recipes.user_id = users.id
      WHERE users.id='${id}'
      ORDER BY recipes.updated_at DESC`,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    )
  );
};

const selectDetailProducts = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT 
        products.id, products.name, products.buying_price, products.selling_price, 
        products.stock, products.photo,
        to_char( products.created_at, 'day, DD Mon YYYY, HH24:MI' ) AS created_at, 
        to_char( products.updated_at, 'day, DD Mon YYYY, HH24:MI' ) AS updated_at
      FROM products AS products
      WHERE products.id='${id}'`,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    )
  );
};

const updateProducts = ({
  id,
  name,
  buying_price,
  selling_price,
  stock,
  photo,
}) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `UPDATE products 
      SET name ='${name}', buying_price ='${buying_price}', selling_price ='${selling_price}', 
        stock ='${stock}', photo ='${photo}', updated_at =NOW()
      WHERE id='${id}' `,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    )
  );
};

const deleteProducts = (id) =>
  Pool.query(`DELETE FROM products WHERE id ='${id}'`);

module.exports = {
  selectAllProducts,
  countAll,
  insertProducts,
  selectRecipes,
  selectDetailProducts,
  updateProducts,
  deleteProducts,
};
