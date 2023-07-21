const rashtrapatiModel = require('../Models/rashtrapatiModel.js');
const fs = require("fs");
const CryptoJS = require("crypto-js");

const rashtrapatiController = async (req, res) => {
  try {
    const { name, ID, party, state, voteCount } = req.fields;
    const { symbol, yourImage } = req.files;

    if (!name || !ID || !party || !state || !voteCount) {
      return res.status(300).send({
        success: false,
        message: "Please enter all the fields.",
      });
    }
    
    const secretKey = process.env.key; // Use the actual secret key from your environment
    const encryptedVoteCount = CryptoJS.AES.encrypt(voteCount.toString(), secretKey).toString();

    if (symbol && symbol.size > 1000000) {
      return res.status(500).send({ error: "Symbol is Required and should be less than 1mb" });
    }

    if (yourImage && yourImage.size > 1000000) {
      return res.status(500).send({ error: "Image is Required and should be less than 1mb" });
    }

    const existingUser = await rashtrapatiModel.findOne({ ID });
    if (existingUser) {
      return res.status(301).send({
        success: false,
        message: "Already Registered"
      });
    }

    const newUser = new rashtrapatiModel({
      name,
      ID,
      party,
      state,
      voteCount: encryptedVoteCount, // Save the encrypted voteCount
    });

    if (symbol) {
      newUser.symbol.data = fs.readFileSync(symbol.path);
      newUser.symbol.contentType = symbol.type;
    }

    if (yourImage) {
      newUser.yourImage.data = fs.readFileSync(yourImage.path);
      newUser.yourImage.contentType = yourImage.type;
    }

    await newUser.save();

    return res.status(200).send({
      success: true,
      message: "You are registered for Rashtrapati Election",
      newUser
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Rashtrapati Call stack",
      error
    });
  }
};

module.exports = rashtrapatiController;
