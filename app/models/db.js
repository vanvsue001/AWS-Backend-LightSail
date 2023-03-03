const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");
//const bluebird = require('bluebird');

let config={
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
 
}
  // create the pool
  const pool = mysql.createPool(config);
  // now get a Promise wrapped instance of that pool
  const promisePool = pool.promise();

  let db={
    query: async (sql, params)=>{
      [result,]=await promisePool.query(sql,params);
      return result;
    }
  }

module.exports = db;