const rashtrapatiModel = require("../Models/rashtrapatiModel.js");
const CryptoJS = require("crypto-js");

const getAllCandidateController = async (req, res) => {
  try {
    const candidates = await rashtrapatiModel.find();

    if (candidates.length === 0) {
      return res.status(400).send({
        success: false,
        message: "No candidates are there.",
      });
    }

    const secretKey = process.env.key; // Use the actual secret key from your environment
    
    const candidateData = candidates.map((candidate) => {
      // Decrypt the voteCount
      const decryptedVoteCount = CryptoJS.AES.decrypt(candidate.voteCount, secretKey).toString(CryptoJS.enc.Utf8);
      const integerVoteCount = parseInt(decryptedVoteCount, 10); // Convert the decryptedVoteCount to an integer
      
      // Convert symbol and yourImage data to Base64 encoded strings
      const symbolData = candidate.symbol
        ? `data:${candidate.symbol.contentType};base64,${candidate.symbol.data.toString("base64")}`
        : null;

      const yourImageData = candidate.yourImage
        ? `data:${candidate.yourImage.contentType};base64,${candidate.yourImage.data.toString("base64")}`
        : null;

      return {
        name: candidate.name,
        ID: candidate.ID,
        party: candidate.party,
        state: candidate.state,
        decryptedVoteCount: integerVoteCount, // Use the integer value
        symbol: symbolData,
        yourImage: yourImageData,
        members_voted: candidate.members_voted,
      };
    });

    return res.status(202).send({
      success: true,
      message: "Successfully retrieved Candidates",
      candidateData,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in updating",
      error
    });
  }
};

module.exports = getAllCandidateController;
