import { Post } from '../models/index.js';
import { Op } from 'sequelize';
import { PubSub } from 'graphql-subscriptions';


export const resolvers = {
    Query: {
      async posts () { 
        return await Post.findAll({order: ['order']})
      }
    },
    Mutation: {
      async UpdatePostOrder(_, {id, order}) {
        const post = await Post.findByPk(id)
        if(post.order < order) {
          // Shuffle rows down to account for post moving up
          await Post.decrement({order: 1}, {where: {order: {
            [Op.lte]: order,
            [Op.gte]: post.order,
          } }})
          post.order = order
          await post.save()
        }
  
        if(post.order > order) {
          // Shuffle rows up to account for post moving down
          await Post.increment({order: 1}, {where: {order: {
            [Op.gte]: order,
            [Op.lte]: post.order
          }}})
          post.order = order
          await post.save()
        }    
        pubsub.publish('ORDER_CHANGED', { orderChanged: true });
      },
    },
    Subscription: {
      orderChanged: {
        subscribe: () => pubsub.asyncIterator(['ORDER_CHANGED']),
      },
    },
  };
  