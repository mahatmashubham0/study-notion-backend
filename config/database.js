const mongoose = require('mongoose')

function connectOfDatabase() {
    try {
        mongoose.connect(process.env.mongo_url , 
            {
            // useNewUrlParser: true, 
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
            // this four line required in the part of when we use the local mongoose
        } ).then(()=>{
            console.log("DB Connect Successfully")
        })
    } catch (error) {
        console.log("DB Connection failed")
        console.log(error)
        process.exit(1);
    }
}

module.exports = connectOfDatabase;