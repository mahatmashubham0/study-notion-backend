const { default: mongoose } = require("mongoose");

const sectionSchema = mongoose.Schema({
  sectionName: {
    type: String,
  },
  subSection: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SubSection"
    },
  ],
});

// this user is exactly User model and struture of user table and inside this user ("Section" , sectionSchema) it is name of collection
// if we want to create the model first we need the name of collection and other id schema of collection which we want to create

module.exports = mongoose.model("Section", sectionSchema);
