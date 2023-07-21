// Update Vote Controller
const voteModel = require("../Models/voteModel");
const CryptoJS = require("crypto-js");

exports.updateVoteController = async (req, res) => {
  try {
    const { voter_ID, member_ID, name, party, constituency, state } = req.body;

    const voter = await voteModel.findOne({ voter_ID });
    if (!voter) {
      return res.status(504).send({
        success: false,
        message: "Voter not found",
      });
    }

    const secretKey = process.env.key;
    const decryptedValue = CryptoJS.AES.decrypt(voter.value, secretKey).toString(CryptoJS.enc.Utf8);

    if (decryptedValue === "true") {
      return res.status(201).send({
        success: false,
        message: "You have already given your vote",
      });
    }

    const id = voter._id;
    const value = true;

    
    // Encrypt the data using AES algorithm
    const encryptedName = CryptoJS.AES.encrypt(name, secretKey).toString();
    const encryptedParty = CryptoJS.AES.encrypt(party, secretKey).toString();
    const encryptedMember_ID = CryptoJS.AES.encrypt(member_ID, secretKey).toString();
    const encryptedConstituency = CryptoJS.AES.encrypt(constituency, secretKey).toString();
    const encryptedState = CryptoJS.AES.encrypt(state, secretKey).toString();
    const encryptedValue = CryptoJS.AES.encrypt(value.toString(), secretKey).toString();

    const updatedVoter = await voteModel.findByIdAndUpdate(
      id,
      {
        name: encryptedName || voter.name,
        party: encryptedParty || voter.party,
        member_ID: encryptedMember_ID || voter.member_ID,
        constituency: encryptedConstituency || voter.constituency,
        state: encryptedState || voter.state,
        value: encryptedValue || voter.value,
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Vote Successfully done HURRAH",
      updatedVoter,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while submitting your vote",
    });
  }
};
