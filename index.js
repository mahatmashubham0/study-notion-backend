const express = require('express')
const env = require('dotenv')
const apiRoutes = require('./routes')
const cors = require('cors');
const connectivityOfDatabase = require('./config/database')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

env.config(); 
//this is required for env data

const app = express();

app.use(express.json());  // this line is used for getting the data from req.body as text, for example in postman for getting data as text
//  so used row section in body
//  
app.use(cookieParser());

app.use( // this line is also used for getting the data from req.body but text and as well other type of data like image file text etc.
// for exm in postman for getting all type of data so used form-data section in body 
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)

app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)


// Database connection
connectivityOfDatabase();

app.use('/api', apiRoutes)

app.listen(process.env.PORT , ()=>{
    console.log("Server is running on" , process.env.PORT || 5500);
})