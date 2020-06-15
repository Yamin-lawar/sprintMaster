import {ApolloServer, gql} from "apollo-server-express"
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser');
const schema = require('./schema.js') 
const mongoose = require('mongoose')
import {typeDefs} from './schema'
import {resolvers} from './resolvers'


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


const AServer = new ApolloServer({
	typeDefs,
	resolvers
})

AServer.applyMiddleware({app});

//const sequelize = require('./utils/database');

const APIRouter = require('./routes/api')


/*attach api route */
app.use  ('/api/v1/',APIRouter)




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
