const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  videoIds: [String],
});

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  lessons: [lessonSchema],
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const courseModel = mongoose.model("Course", courseSchema);
module.exports = courseModel;
