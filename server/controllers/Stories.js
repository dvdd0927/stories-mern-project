const { StatusCodes } = require("http-status-codes");
const StorySchema = require("../models/Stories");
const { NotFoundError } = require("../errors");

const getAllStories = async (req, res) => {
  const data = await StorySchema.find({});

  if (!data) {
    data = [];
  }

  res.status(StatusCodes.OK).json(data);
};

const createStory = async (req, res) => {
  const newStory = await StorySchema.create(req.body);

  res.status(StatusCodes.CREATED).json({ newStory, msg: "Story Published!" });
};

const updateStory = async (req, res) => {
  const findData = await StorySchema.findOne({ _id: req.params.id });

  if (!findData) {
    throw new NotFoundError(`Story that you are trying to edit doesn't exist`);
  }

  const newData = await StorySchema.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ msg: "Story Updated!" });
};

const deleteStory = async (req, res) => {
  const findData = await StorySchema.findOne({ _id: req.params.id });

  if (!findData) {
    throw new NotFoundError(
      `Story that you are trying to delete doesn't exist`
    );
  }

  const deleteData = await StorySchema.findOneAndRemove({ _id: req.params.id });

  res.status(StatusCodes.OK).json({ msg: "Story Deleted!" });
};

module.exports = {
  getAllStories,
  createStory,
  updateStory,
  deleteStory,
};
