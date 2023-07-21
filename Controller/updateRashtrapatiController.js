const rashtrapatiModel = require('../Models/rashtrapatiModel.js');
const CryptoJS = require('crypto-js');

exports.updateRashtrapatiController = async (req, res) => {
  try {
    const { mem_voted, ID, voteCount } = req.body;
  
    const rashtrapatiMember = await rashtrapatiModel.findOne({ ID });
    if (!rashtrapatiMember) {
      return res.status(504).send({
        success: false,
        message: "Rashtrapati Candidate not found",
      });
    }

    // Check if mem_voted is already present in members_voted array
    if (rashtrapatiMember.members_voted.includes(mem_voted)) {
      return res.status(201).send({
        success: false,
        message: "You have already voted for this Rashtrapati Candidate",
      });
    }

    const secretKey = process.env.key;
    const encryptedVoteCount = CryptoJS.AES.encrypt(voteCount.toString(), secretKey).toString();

    const id = rashtrapatiMember._id;
    const updatedData = await rashtrapatiModel.findByIdAndUpdate(
      id,
      {
        voteCount: encryptedVoteCount, // Save the encrypted voteCount
        $push: { members_voted: mem_voted }
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "You have voted successfully for Rashtrapati Elections",
      updatedData
    });

  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error in Rashtrapati Call stack",
      error
    });
  }
};
