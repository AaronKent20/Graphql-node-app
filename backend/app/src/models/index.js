import {dbConfig} from "../config/db.config.js"
import { LoremIpsum } from "lorem-ipsum";

import { Sequelize, DataTypes } from "sequelize";

let sequelize;


if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.DB_URL);
} else {
  sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
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
}

const Post = sequelize.define('Post',
  {
    title: {
      type: DataTypes.STRING,
    },
    order: {
      type: DataTypes.INTEGER,
    }
  },  {
    freezeTableName: true,
  },
);

sequelize.sync().then(()=> {
  console.log("Model Synced")
})

const seedData = ((count)=> {
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4
    },
    wordsPerSentence: {
      max: 16,
      min: 4
    }
  }); 

  for(let i = 0; i < count; i++)
    Post.create({title: lorem.generateWords(7), order: i+1})

})

export { Post }

