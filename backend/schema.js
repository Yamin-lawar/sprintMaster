const typeDefs = [`
  
  type Event {
    _id: ID!
    title: String!
    description: String
    price: Float!
    date: String! 
  }
  type Query {
    events: [Event!]! 
  }
  input EventInput{
    title: String!
    description: String
    price: Float!
    date: String!
  }
  type Mutation{
    createEvent(eventInput: EventInput): Event
  }
`]

module.exports = {typeDefs}