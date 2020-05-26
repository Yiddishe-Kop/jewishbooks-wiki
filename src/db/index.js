const Sequelize = require("sequelize");
const sqlite3 = require('sqlite3').verbose()

const sequelize = new Sequelize({
  dialect: 'sqlite',
  dialectModule: sqlite3,
  storage: './src/db/db.sqlite'
});

const Article = sequelize.define('article', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT
  }
}, {
  modelName: 'article'
});

// sequelize.sync()

export { sequelize, Article }
