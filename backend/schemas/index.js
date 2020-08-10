import {mergeTypes, fileLoader} from 'merge-graphql-schemas'
const path = require('path')
import {buildSchema} from 'graphql'

const typesArray = fileLoader(path.join(__dirname, '.'), { recursive: true })
const mergeDefs = mergeTypes(typesArray, {all: true})
module.exports = buildSchema(mergeDefs)

