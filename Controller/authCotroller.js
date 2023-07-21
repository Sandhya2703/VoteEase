const jsonwebtoken = require("jsonwebtoken");
const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

exports.registerController = async(req,res) => {
      try {
            const {name, email, voter_ID, aadhar, area, password, age, uniqueKey} = req.body;

            // Checking whether user had entered all the details or not
            if(!name)
            {
                  return res.status(400).send({
                        success: false,
                        message : "Please Enter your Name"
                  })
            }
            if(!email)
            {
                  return res.status(400).send({
                        success: false,
                        message : "Please Enter your Email"
                  })
            }
            if(!voter_ID)
            {
                  return res.status(400).send({
                        success: false,
                        message : "Please Enter your Voter ID"
                  })
            }
            if(!aadhar)
            {
                  return res.status(400).send({
                        success: false,
                        message : "Please Enter your Aadhar Card Number"
                  })
            }
            if(!area)
            {
                  return res.status(400).send({
                        success: false,
                        message : "Please Enter your Area"
                  })
            }
            if(!password)
            {
                  return res.status(400).send({
                        success: false,
                        message : "Please Enter your Password"
                  })
            }
            if(!age)
            {
                  return res.status(400).send({
                        success: false,
                        message : "Please Enter your Age"
                  })
            }
            if(!uniqueKey)
            {
                  return res.status(400).send({
                        success: false,
                        message : "Please Enter your Favorite Sports"
                  })
            }

            // Check if the user is existing or not
            const existingUser = await userModel.findOne({voter_ID});
            if(existingUser)
            {
                  return res.status(300).send({
                        success : "false",
                        message : "Already registered, Please Login"
                  })
            }

            // hash the password using bcrypt library for security
            const hashed = await bcrypt.hash(password, 7);

            // If the user doesn't exists save the data into mongo Db
            const newUser = new userModel({name, email, voter_ID, aadhar, area, password:hashed, age, uniqueKey});
            
            newUser.save();

            return res.status(200).send({
                  success : true,
                  message : "User Registered Successfully"
            })

      } catch (error) {
            console.log(error);
            return res.status(500).send({
                  success : false,
                  message : "Error in Register Call Stack",
                  error
            });
      }
}

exports.loginController = async(req,res) => {
      try {
            const {voter_ID, email, password} = req.body;
            // Check whether the user had entered the details or not
            if(!voter_ID || !email || !password)
            {
                  return res.status(300).send({
                        success: false,
                        message : "Please Enter all the fields"
                  })
            }

            const user = await userModel.findOne({voter_ID});

            if(!user)
            {
                  return res.status(301).send({
                        success: false,
                        message : "Please register yourself"
                  })
            }

            const pass = await bcrypt.compare(password, user.password);

            if(!pass)
            {
                  return res.status(302).send({
                        success: false,
                        message : "Incorrect voter_ID, email or password"
                  })
            }

            const token = await jsonwebtoken.sign({_id: user.id}, process.env.JWT_SECRET, {expiresIn : "7d"});

            return res.status(200).send({
                  success : true,
                  message : "Login Successfull",
                  user : {
                        name : user.name,
                        email : user.email,
                        voter_ID : user.voter_ID,
                        aadhar : user.aadhar,
                        area : user.area,
                        age : user.age
                  },
                  token
            })


      } catch (error) {
            console.log(error);
            return res.status(500).send({
                  success : false,
                  message : "Error in Login Call stack",
                  error
            })
      }
}

exports.forgotPassword = async(req, res) => {
      try {
            const {email, uniqueKey, newPassword} = req.body;
            if(!email || !uniqueKey || !newPassword)
            {
                  return res.status(400).send({
                        success : false,
                        message : "Please enter all the fields"
                  })
            }

            const user = await userModel.findOne({email, uniqueKey});

            // Check if the entered valid email and unique key
            if(!user)
            {
                  return res.status(300).send({
                        success : false,
                        message : "Incorrect email or unique key"
                  })
            }

            const hashed = await bcrypt.hash(newPassword, 7);

            await userModel.findByIdAndUpdate(user._id, {password:hashed});
            return res.status(200).send({
                  success : true,
                  message : "Password Reset Successful"
            })

            
      } catch (error) {
            console.log(error);
            return res.status(404).send({
                  success: false,
                  message : "Error in forgot Password callstack",
                  error
            })
      }
}

exports.emailController = async(req, res) => {
      // Send the mail to the user
      const { userEmail, userName } = req.body;
      
      let config = {
            service : 'gmail',
            auth : {
                  user : process.env.EMAIL,
                  pass : process.env.PASSWORD 
            }
      }

      let transporter = nodemailer.createTransport(config);

      let MailGenerator = new Mailgen({
            theme : "default",
            product : {
                  name : "Election Commission of India",
                  link : 'https://mailgen.js/'
            }
      })

      let response = {
            body : {
                  name : userName,
                  intro : "You have successfully voted",
                  data : 
                  [
                        {
                              item : "Voting",
                              description: "Thank you for giving your valuable vote"
                        }
                  ],
                  outro : "Looking forward to meet you on the result Day"
            }
      }

      let mail = MailGenerator.generate(response);

      let message = {
            from : process.env.EMAIL,
            to : userEmail,
            subject : "Voting Done",
            html : mail
      }

      transporter.sendMail(message).then(() => {
            return res.status(201).send({
                  success : true,
                  message : "Email Received"
            })
      }).catch(error => {
            return res.status(500).send({
                  success : false,
                  message : "Error while sending Email",
                  error
            })
      })
}