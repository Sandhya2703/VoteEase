const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
      {
            name : {
                  type : String,
                  required : true,
                  message : "Name is Required"
            },
            email : {
                  type: String,
                  required : true,
                  message : "Email is Required"

            },
            voter_ID : {
                  type: String,
                  required : true,
                  message : "Email is Required",
                  unique: true

            },
            aadhar : {
                  type: String,
                  required : true,
                  message : "Email is Required",
                  unique: true

            },
            area : {
                  type: String,
                  required : true,
                  message : "Email is Required"

            },
            password : {
                  type: String,
                  required : true,
                  message : "Password is Required"
            },
            age : {
                  type: Number,
                  required : true,
                  message : "Age is Required"
            },
            uniqueKey : {
                  type: String,
                  required : true,
                  message : "Unique Key is Required"
            }
      },
      {
            timestamps : true
      }
)
const userModel = mongoose.model("user", userSchema)

module.exports = userModel;