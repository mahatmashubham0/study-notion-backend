const express = require('express')
const env = require('dotenv')
const apiRoutes = require('./routes')
const cors = require('cors');
const connectivityOfDatabase = require('./config/database')

env.config(); 
//this is required for env data

const app = express();

app.use(cors());

app.use(express.json());  
app.use(express.urlencoded({extended: true,}))
// this is required for the taking data from user this two line is neccesary

// Database connection
connectivityOfDatabase();

app.use('/api', apiRoutes)

app.listen(process.env.PORT , ()=>{
    console.log("Server is running on" , process.env.PORT || 5500);
})