import {dbConfig} from "../config/db.config.js"

import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const Post = sequelize.define('Post',
  {
    title: {
      type: DataTypes.STRING,
    },
    order: {
      type: DataTypes.INTEGER
    }
  },  {
    freezeTableName: true,
  },
);

sequelize.sync().then(()=> {
  console.log("Model Synced")
})

export { Post }

