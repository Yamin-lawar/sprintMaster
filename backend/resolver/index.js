import teamResolver from './teamResolver'
import userResolver from './userResolver'
import projectResolver from './projectResolver'

const rootResolver = {
  ...teamResolver,
  ...userResolver,
  ...projectResolver
}

module.exports = rootResolver;

