import {buildSchema} from 'graphql'
const typeDefs = buildSchema(`
  scalar Date
  
  type Team {
    _id: ID!
    name: String!
    skills: String
    createdAt: String  
  }
  type User {
    _id: ID!,
    firstName: String!
    lastName: String!
    email: String!
    skills: String
    mobileNo: String
    avtaar: String
    team: Team
    createdAt: String
  }
  type Query {
    teams: [Team!]! 
    users: [User!]!
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
  input UserInput{
    firstName: String!
    password: String!
    lastName: String!
    email: String!
    skills: String
    mobileNo: String
    avtaar: String
    team: ID!
  }
  type AddUserPayload{
    error: [error],
    user: User
  }
  type Mutation{
    userInputError(input: String): String
    createTeam(input:TeamInput): AddTeamPayload
    createUser(input:UserInput): AddUserPayload
  }
`)

module.exports = {typeDefs}