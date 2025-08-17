const mongoose = require("mongoose");
const User = require("../../Models/user");
const { Validator } = require("node-input-validator");
//const responceCode = require("../../ResponseCode/responce")
const passwordHash = require("password-hash");
//const { DBerror, InputError } = require("../../service/errorHandeler");
var jwt = require("jsonwebtoken");
//const path = require("path");
//const S3 = require("../../service/s3");


function createToken(data) {
    return jwt.sign(data, "DonateSmile");
}

const getTokenData = async (token) => {
    let adminData = await User.findOne({ token: token }).exec();
    return adminData;
};


//   const register = async (req, res) => {
//     try {
//         // Check if user already exists
//         const check = await User.aggregate([
//             {
//                 $match: {
//                     isDeleted: false,
//                     emailID: req.body.emailID,
//                     type: req.body.type,
//                 },
//             },
//         ]);

//         if (check.length > 0) {
//             return res.status(responceCode.errorCode.dataExist).json({
//                 status: false,
//                 message: "User already exists!",
//             });
//         }

//         // Generate OTP
//         const otp = Math.floor(1000 + Math.random() * 9000);

//         // Prepare user data
//         const userData = {
//             ...req.body,
//             password: passwordHash.generate(req.body.password),
//             token: createToken(req.body),
//             otp: otp,
//             createdOn: new Date(),
//         };

//         // Insert user into database
//         const userInsert = new User(userData);
//         const data = await userInsert.save();

//         return res.status(responceCode.errorCode.success).json({
//             status: true,
//             message: "User created successfully",
//             data: data.token,
//         });

//     } catch (error) {
//         console.error(error);
//         const errors = DBerror(error);
//         return res.status(responceCode.errorCode.serverError).json({
//             status: false,
//             message: "Server error, please try again",
//             error: errors,
//         });
//     }
// };


const register = async (req, res) => {
    try {
        // Check if user already exists
        const check = await User.findOne({
            isDeleted: false,
            email: req.body.email, // Matching schema // Matching schema
        });

        if (check) {
            return res.status(400).json({
                status: false,
                message: "User already exists!",
            });
        }

        // Prepare user data
        const userData = {
            name:req.body.name,
            email: req.body.email,
            password: passwordHash.generate(req.body.password),
            token: createToken(req.body),
        };

        // Insert user into database
        const userInsert = new User(userData);
        const data = await userInsert.save();

        return res.status(200).json({
            status: true,
            message: "User created successfully",
            data: data,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Server error, please try again",
            error: error.message,
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email, isDeleted: false });
        if (!user) {
            return res.status(400).json({
                status: false,
                message: "Invalid email or password!",
            });
        }

        // Check password
        const isMatch = user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                status: false,
                message: "Invalid email or password!",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Login successful",
            data: user // Sending user token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Server error, please try again",
            error: error.message,
        });
    }
};




module.exports = {
    getTokenData,
    register,login
   
    
};



