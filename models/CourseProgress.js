const { default: mongoose } = require("mongoose");

const courseProgressSchema = mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection", // we are used CompletedVideos column that indicate the Subsection of section this subsection is associated with the one video
    },
  ],
});

// this user is exactly User model and struture of user table and inside this user ("CourseProgress" , courseProgressSchema) it is name of collection
// if we want to create the model first we need the name of collection and other id schema of collection which we want to create

module.exports = mongoose.model("CourseProgress", courseProgressSchema);
