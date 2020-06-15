const typeDefs = [`
  
  type Team {
    _id: ID!
    name: String!
    skills: String,
    createdAt: Number  
  }
  type Query {
    teams: [Team!]! 
  }
  input TeamInput{
    name: String!
    skills: String
  }
  type Mutation{
    createTeam(input:TeamInput): Team
  }
`]

module.exports = {typeDefs}