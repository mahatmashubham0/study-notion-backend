const { default: mongoose } = require("mongoose");

const courseSchema = mongoose.Schema({
  courseName: {
    type: String,
  },
  courseDescription: {
    type: String,
  },
  instrutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  whatYouWillLeaen: {
    type: String,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
  ],
  ratingAndReview: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
      required: true,
    },
  ],
  price: {
    type: String,
  },
  thumbnails: {
    type: String,
  },
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Tag",
  },
  studentEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
});

// this user is exactly User model and struture of user table and inside this user ("Section" , sectionSchema) it is name of collection
// if we want to create the model first we need the name of collection and other id schema of collection which we want to create

module.exports = mongoose.model("Course", courseSchema);
