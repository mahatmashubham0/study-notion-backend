const { default: mongoose } = require("mongoose");

const profileSchema = mongoose.Schema({
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  dateOfBirth: {
    type: String,
    trim: true,
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: String,
  },
});

// this user is exactly User model and struture of user table and inside this user ("Profile" , profileSchema) it is name of collection
// if we want to create the model first we need the name of collection and other id schema of collection which we want to create

module.exports = mongoose.model("Profile", profileSchema);
