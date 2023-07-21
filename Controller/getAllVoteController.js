// Get All Vote Controller
const voteModel = require("../Models/voteModel.js");
const CryptoJS = require("crypto-js");

exports.getAllVoteController = async (req, res) => {
  try {
    const secretKey = process.env.key; // Accessing the secret key from process.env

    const votes = await voteModel.find();

    // Check if there are no votes
    if (votes.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No votes found",
      });
    }

    // Decrypt the votes
    const decryptedVotes = votes.map((vote) => ({
      name: CryptoJS.AES.decrypt(vote.name, secretKey).toString(CryptoJS.enc.Utf8),
      party: CryptoJS.AES.decrypt(vote.party, secretKey).toString(CryptoJS.enc.Utf8),
      member_ID: CryptoJS.AES.decrypt(vote.member_ID, secretKey).toString(CryptoJS.enc.Utf8),
      constituency: CryptoJS.AES.decrypt(vote.constituency, secretKey).toString(CryptoJS.enc.Utf8),
      state: CryptoJS.AES.decrypt(vote.state, secretKey).toString(CryptoJS.enc.Utf8),
      value: CryptoJS.AES.decrypt(vote.value, secretKey).toString(CryptoJS.enc.Utf8),
    }));

    // Return the decrypted votes
    return res.status(200).send({
      success: true,
      message: "Votes retrieved successfully",
      votes: decryptedVotes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while retrieving votes",
      error,
    });
  }
};