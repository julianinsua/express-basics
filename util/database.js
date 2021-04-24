const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "LuJu2104", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
