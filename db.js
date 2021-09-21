const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_TABLE,
});

module.exports = {
  getConnection: function () {
    return new Promise(function (resolve, reject) {
      pool
        .getConnection()
        .then(function (connection) {
          resolve(connection);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  },
};
