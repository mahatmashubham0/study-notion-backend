const { default: mongoose } = require("mongoose");

const subSectionSchema = mongoose.Schema({
  title: {
    type: String,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
});

// this user is exactly User model and struture of user table and inside this user ("SubSection" , subSectionSchema) it is name of collection
// if we want to create the model first we need the name of collection and other id schema of collection which we want to create

module.exports = mongoose.model("SubSection", subSectionSchema);
