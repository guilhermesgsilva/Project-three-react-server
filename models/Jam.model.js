const { Schema, model } = require("mongoose");

const jamSchema = new Schema(
  {
    jamCity: {
      type: String,
      required: true,
    },
    jamAddress: {
      type: String,
      required: true,
    },
    jamDate: {
      type: String,
      required: true,
    },
    jamStartTime: {
      type: String,
      required: true,
    },
    jamEndTime: String,
    jamPicture: {
      type: String,
      default: "https://res.cloudinary.com/dugsgijal/image/upload/v1633684922/projects/bii9lxw44rmnyttoqska.jpg",
    },
    jamDescription: String,
    jamCreator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // jamAdmins: [{
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    // }],
    jamUsers:  [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    jamPosts:  [{
      type: Schema.Types.ObjectId,
      ref: "Post",
    }],
  },
  {timestamps: true}
);

const Jam = model("Jam", jamSchema);

module.exports = Jam;
