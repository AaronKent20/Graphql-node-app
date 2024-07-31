export const typeDefs = `#graphql
  type Post {
    id: Int
    title: String
    order: Int
  }

  type Query {
    posts: [Post]
  }
  
  type Mutation { 
    UpdatePostOrder(
      id: Int
      order: Int
    ): Post
  }

  type Subscription {
    orderChanged: Boolean
  }
`;
