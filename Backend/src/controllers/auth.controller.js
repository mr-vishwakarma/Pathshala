const User = require("../models/user.model");

const registerUser = async(req, res) => {
    try {
        res.status(201).json({
            message:"Register Route working",
        })
        
    } catch (error) {
        res.status(500).json({
            message:error.message,
        }) 
    }
}

module.exports = {registerUser, }