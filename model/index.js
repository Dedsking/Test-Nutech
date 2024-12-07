const dbConfig = require("../config/dbConfig");
const mysql = require("mysql2");

const { Sequelize, DataTypes } = require("sequelize");

const { HOST, PORT, USER, PASSWORD, DB } = dbConfig;

// create database
const pool = mysql.createPool({ HOST, PORT, USER, PASSWORD });

pool.query(`CREATE DATABASE IF NOT EXISTS \`${DB}\`;`);

// koneksi ke database
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER,
  process.env.PASSWORD,
  // dbConfig.PORT,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    // operatorsAliases: false,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const db = {};

db.sequelize = sequelize;

db.users = require("./usersModel.js")(sequelize, DataTypes);
db.sequelize.sync({ force: false }).then(() => {
  console.log("re-sync database ...");
});

module.exports = db;
