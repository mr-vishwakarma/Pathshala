const User = require('../models/user.model');
const bcrypt = require("bcryptjs");

const registerUser = async(req, res) => {
    try {
        const {fullname, email, password} = req.body; 

        const existingUser = await User.findOne({ 
            email,
        })

        if(existingUser) {
            return res.status(400).json({
                message:"User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message:"User created Sucessfully",
        })
        
    } catch (error) {
        res.status(500).json({
            message:error.message,
        });
    }
}

module.exports = {registerUser};