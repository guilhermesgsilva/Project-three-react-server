const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    postText: String,
    postMedia: String, // Is it possiblie tu upload multiple images and videos at the same time?
    // postImages: [{
    //   type: String,
    // }],
    // postVideos: [{
    //   type: String,
    // }],
    postUserCreator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {timestamps: true}
);

const Post = model("Post", postSchema);

module.exports = Post;