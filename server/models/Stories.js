const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Stories", StorySchema);
