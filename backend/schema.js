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
  type error{
    name: String,
    message: String
  }
  input TeamInput{
    name: String!
    skills: String
  }
  type AddTeamPayload{
    error: [error],
    team: Team
  }
  type Mutation{
    userInputError(input: String): String
    createTeam(input:TeamInput): AddTeamPayload
  }
`]

module.exports = {typeDefs}