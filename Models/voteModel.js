const mongoose = require("mongoose")

const voterSchema = new mongoose.Schema(
      {
            voter_ID : {
                  type : String,
                  required : true,
                  message : "Voter ID is Required"
            },
            member_ID : {
                  type : String
            },
            name : {
                  type : String
            },
            party : {
                  type : String
            },
            constituency : {
                  type : String
            },
            state : {
                  type : String
            },
            value : {
                  type: String,
                  message : "Value is Required"
            }
})
module.exports = mongoose.model("VoteDatabase", voterSchema);