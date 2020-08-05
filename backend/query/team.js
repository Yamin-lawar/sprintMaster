import {buildSchema} from 'graphql'
const teamSchema = buildSchema(`
  type Team {
    _id: ID!
    name: String!
    skills: String
    createdAt: String  
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
    createTeam(input:TeamInput): AddTeamPayload
  }
`);
module.exports = {teamSchema}