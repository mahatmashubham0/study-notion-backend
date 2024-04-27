const { default: mongoose } = require("mongoose");
const mailSender = require("../utils/mail-sender");
const emailTemplate = require('../templates/emailVerification')


const otpSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),     // by default this column has Date value
    expires: 5*60          
  },
});


// this function send otp msg to the user on email
async function sendVarificationemail(email , otp){
    try {
        const mailResponse = await mailSender(email, "Verification of email from us production of study Place ", emailTemplate(otp));
        console.log("Email sent successfully" , mailResponse.response);
    } catch (error) {
        console.log("error generating while sendind to user" , error)
    }
}

// why we wtrie this code here becuase we want to save data on database after the successfully email verification and there otpSchema has 
// pre function first send email and after that save data on Otp database.

otpSchema.pre("save" , async function(next){
    await sendVarificationemail(this.email , this.otp);
    next();
})

module.exports = mongoose.model("Otp", otpSchema);
