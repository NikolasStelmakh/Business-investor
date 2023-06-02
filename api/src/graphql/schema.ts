export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  
  type User {
    id: ID!
    name: String!
  }
  type Categorie {
    id: Int!
    title: String!
  }
  type RecurringInterval {
    id: Int!
    name: String!
  }
  type Task {
    id: Int!
    name: String!
    start_date: String!
    categorie_id: Int!
    categorie: Categorie
    recurring_interval_id: Int
    recurring_interval: RecurringInterval
    user_id: String!
    user: User
  }
  
  type StaticData {
    categories: [Categorie]
    recurringIntervals: [RecurringInterval]
  }


  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    users: [User]
    staticData: StaticData
    tasks(userId: ID!, limit: Int, offset: Int): [Task]
  }
  
  type Mutation {
    createTask(name: String!, userId: ID!, categorieId: Int!, recurringIntervalId: Int, startDate: String): Task
  }
`;
