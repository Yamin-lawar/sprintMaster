import {buildSchema} from 'graphql'
const userSchema = buildSchema(`

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
  users: [User!]!
}
type error{
  name: String,
  message: String
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
  createUser(input:UserInput): AddUserPayload
}
`);

module.exports = {userSchema}