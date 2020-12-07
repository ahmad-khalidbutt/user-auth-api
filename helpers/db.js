const config = require("../config/config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

module.exports = db = {};

initialize();

async function initialize() {
  // create database if it does not exists
  const { host, port, user, password, database } = config.database;
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // connect to database
  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
  });

  // initialize models and add them to exported db object
  db.User = require("../users/user.model")(sequelize);

  //sync all models with database

  await sequelize.sync();
}
