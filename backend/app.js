const http = require('http')
const path = require('path')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

import typeDefs from './schemas'
import rootResolver from './resolver/index'
const { graphqlHTTP} = require('express-graphql')
const expressPlayground = require('graphql-playground-middleware-express')
	.default
const express = require('express')
const dotenv = require('dotenv');
const cors = require('cors')
dotenv.config();
const app = express()
app.use(cors())

/*to serve all file staticslly inside this path*/
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.json());
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.set('views', path.join(__dirname, 'views'));
//const AServer = new ApolloServer({
	//schema
	//formatError: (err) => ({ message: typeof err.extensions.exception.name !== undefined && err.extensions.exception.name == 'customError' ? err.message : 'Internal server error', status: typeof err.extensions.exception.code !== undefined ? err.extensions.exception.code: 500 })
	/*formatError: (err) => {
		console.log(err)
	}*/
//})

//AServer.applyMiddleware({app});


app.use('/graphql',graphqlHTTP({
	schema: typeDefs,
	rootValue: rootResolver,
	customFormatErrorFn: (error) => ({
		message:  typeof error.customError !== undefined ? error.message : 'Internal server error',
		path: typeof error.customError !== undefined ? error.path : 'No path sepcified'
		//status: typeof error.extensions.exception.code !== undefined ? error.extensions.exception.code: 500,
	})

}))
app.get('/', expressPlayground({ endpoint: '/graphql' }))
app.get('/',(req, res)=>{
	res.status(400);
	res.send({"success":"Your server is up and running"})
})

app.use((req,res,next)=>{
	res.status(404).send({"error":"Route not found"})
})

const server = http.createServer(app)
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PSW}@ticketingsystem-araam.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,{ useUnifiedTopology: true, useNewUrlParser: true })
.then(() => {
	server.listen(process.env.PORT || 4002)	
})
.catch(err =>{
	console.log(err)
})
