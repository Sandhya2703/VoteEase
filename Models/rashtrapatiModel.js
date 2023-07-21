const mongoose = require('mongoose');

const rashtrapatiModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      message: "Name is Required",
    },
    ID: {
      type: String,
      unique: true,
      required: true,
      message: "ID is Required",
    },
    party: {
      type: String,
      required: true,
      message: "Party Name is Required",
    },
    state: {
      type: String,
      required: true,
      message: "State name is Required",
    },
    voteCount: {
      type: String, // Change the type to String
    },
    symbol: {
      data: Buffer,
      contentType: String,
    },
    yourImage: {
      data: Buffer,
      contentType: String,
    },
    members_voted: {
      type: [Number],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("rashtrapatiDatabase", rashtrapatiModel);
