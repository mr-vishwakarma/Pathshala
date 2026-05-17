const transporter = require("../config/mail")

const sendEmail = async(
    to, subject,text
)=>{
    try {
        await transporter.sendMail({
            from :process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
    console.log("Email sent");
    
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports = sendEmail;
