const { default: mongoose } = require("mongoose");
const mailSender = require("../utils/main-sender");

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


// this function send email to the user
async function sendVarificationemail(email , otp){
    try {
        const mailResponse = await mailSender(email, "Verification of email from us production of study Place ", otp);
        console.log("Email send successfully" , mailResponse);
    } catch (error) {
        console.log("error generating while sendind to user" , error)
    }
}

// why we wtrie this code here becuase we want to save data on database after the successfully email verification and there otpSchema has 
// pre function that done is work

otpSchema.pre("save" , async function(next){
    await sendVarificationemail(this.email , this.otp);
    next();
})

module.exports = mongoose.model("Otp", otpSchema);
