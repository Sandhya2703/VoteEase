const voteModel = require("../Models/voteModel");

exports.voterController = async(req, res) => {
      try {
            const { voter_ID, member_ID, name, party, constituency, state, value } = req.body;

            const newVoter = new voteModel({ voter_ID, member_ID, name, party, constituency, state, value });
            newVoter.save();

            return res.status(200).send({
                  success: true,
                  message: "Voter Data Registered Successfully"
         })
      } catch (error) {
            console.log(error);
            res.status(500).send({
                  success:false,
                  message:"Error in Voter Controller"
            })
      }
}