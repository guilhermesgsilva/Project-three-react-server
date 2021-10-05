const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    postText: String,
    postUserCreator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {timestamps: true}
);

const Post = model("Post", postSchema);

module.exports = Post;