const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
