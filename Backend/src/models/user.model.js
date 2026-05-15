const {mongoose } = require("mongoose");

const userSchema = new mongoose.userSchema(
    {
        fullname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        password:{
            type:String,
            required:true,
        },
        profilePhoto:{
            type:String,
            default:"",
        },
        isVerified:{
            type:Boolean,
            default:false,
        },
    },
    {
        timestamps:true,
    },

);


module.exports = mongoose.model("User", userSchema);

