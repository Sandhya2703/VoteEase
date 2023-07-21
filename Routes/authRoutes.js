const express = require("express");
const { registerController, loginController, forgotPassword, emailController } = require("../Controller/authCotroller");
const { voterController } = require("../Controller/voteController");
const { updateVoteController } = require("../Controller/updateVoteController");
const { getAllVoteController } = require("../Controller/getAllVoteController");
const rashtrapatiController = require("../Controller/rashtrapatiController");
const formidable = require('express-formidable');
const {updateRashtrapatiController} = require("../Controller/updateRashtrapatiController");
const getAllCandidateController = require("../Controller/getAllCandidatesController");

const router = express.Router();

// router.method can be anything like get post put delete, etc then ("/path", callback Function)
router.post('/register', registerController); // Register

router.post('/login', loginController); // Login

router.post('/forgot', forgotPassword); // Forgot Password

router.post('/sendEmail', emailController); // Send Mail

router.post('/voter', voterController); // Voter Database Path

router.put('/updateVoter', updateVoteController); // Voter Database Updating Path

router.get('/all-vote', getAllVoteController); // getting all votes path

router.post('/rashtrapatiRegister', 
            formidable(),
            rashtrapatiController); // Making rashtrapati candidates for elections

router.put('/updatedRashtrapatiVote', updateRashtrapatiController); // updating them after any vote

router.get('/all-candidates', getAllCandidateController); // getting all candidates of rashtrapati elections

module.exports = router;