const {
  getAllStories,
  createStory,
  updateStory,
  deleteStory,
} = require("../controllers/Stories");

const router = require("express").Router();

router.route("/").get(getAllStories);
router.route("/").post(createStory);
router.route("/:id").patch(updateStory).delete(deleteStory);

module.exports = router;
