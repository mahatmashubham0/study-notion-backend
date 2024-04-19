const { default: mongoose } = require("mongoose");

const tagSchema = mongoose.Schema({
  name: {
    type: Number,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
});

// this user is exactly User model and struture of user table and inside this user ("RatingAndReview" , ratingAndReviewSchema) it is name of collection
// if we want to create the model first we need the name of collection and other id schema of collection which we want to create

module.exports = mongoose.model("Tag", tagSchema);
