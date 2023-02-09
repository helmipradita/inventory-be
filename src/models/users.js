const Pool = require('./../config/db');

const register = (data) => {
  const { id, fullname, email, password, otp } = data;
  return new Promise((resolve, reject) =>
    Pool.query(
      `INSERT INTO users 
      (id, fullname, email, password, verif, otp, created_at, updated_at) 
      VALUES
      ('${id}', '${fullname}', '${email}', '${password}', 1, '${otp}', NOW(), NOW())
      `,
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

const findEmail = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM users WHERE email='${email}'`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const findIdUser = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `
    SELECT users.id, users.fullname, users.email, users.photo,
        to_char( users.created_at, 'day, DD Mon YYYY, HH24:MI' ) AS created_at, 
        to_char( users.updated_at, 'day, DD Mon YYYY, HH24:MI' ) AS updated_at
    FROM users AS users
    WHERE users.id='${id}'
    `,
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

const verif = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `UPDATE users SET verif=1 WHERE email='${email}'`,
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

const updateProfile = (data) => {
  const { id, fullname, email, photo } = data;
  return new Promise((resolve, reject) =>
    Pool.query(
      `UPDATE users 
      SET id='${id}', fullname='${fullname}', email='${email}', 
        photo='${photo}' 
      WHERE id='${id}'`,
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

module.exports = {
  register,
  findEmail,
  findIdUser,
  verif,
  updateProfile,
};
