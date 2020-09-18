import teamResolver from './teamResolver'
import userResolver from './userResolver'
import projectResolver from './projectResolver'
import sprintResolver from './sprintResolver'

const rootResolver = {
  ...teamResolver,
  ...userResolver,
  ...projectResolver,
  ...sprintResolver
}

module.exports = rootResolver;

