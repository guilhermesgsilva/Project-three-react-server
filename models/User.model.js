const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true
    },
    userPassword: {
      type: String,
      required: true,
    },
    userTitle: {
      type: String,
    },
    userPicture: {
      type: String,
      default: "http://placekitten.com/200/200",
    },
    userDescription: String,
    userReviewsReceived: [{
      type: Schema.Types.ObjectId,
      ref: "Review",
    }],
    userFollows: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    userJamsCreated: [{
      type: Schema.Types.ObjectId,
      ref: "Jam",
    }],
    userJamsAdmin: [{
      type: Schema.Types.ObjectId,
      ref: "Jam",
    }],
    userJams: [{
      type: Schema.Types.ObjectId,
      ref: "Jam",
    }],
  },
  {timestamps: true}
);

const User = model("User", userSchema);

module.exports = User;
