import teamResolver from './teamResolver'
import userResolver from './userResolver'

const rootResolver = {
  ...teamResolver,
  ...userResolver
}

module.exports = rootResolver;

