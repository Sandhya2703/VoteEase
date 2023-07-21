
const color = require ("colors")
const mongoose = require("mongoose")

const connectDB = async() => {
      try{
            const connect = await mongoose.connect(process.env.MONGO_DB);
            console.log(`Connected to Mongo DB database ${connect.connection.host}`.bgMagenta.white);
      }
      catch(error){
            console.log(`Error in Mongo DB ${error}`);
      }
}

module.exports = connectDB;