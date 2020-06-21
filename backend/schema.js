const typeDefs = [`
  scalar Date
  
  type Team {
    _id: ID!
    name: String!
    skills: String
    createdAt: Date  
  }
  type Query {
    teams: [Team!]! 
  }
  input TeamInput{
    name: String!
    skills: String
  }
  type Mutation{
    userInputError(input: String): String
    createTeam(input:TeamInput): Team
  }
`]

module.exports = {typeDefs}