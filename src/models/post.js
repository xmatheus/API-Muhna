const mongoose = require("../database");
const user = require("./User");
const mongoosePaginate = require("mongoose-paginate");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  post: {
    type: String,
    require: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user,
    require: true
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

PostSchema.plugin(mongoosePaginate); //teste

const post = mongoose.model("Post", PostSchema);
module.exports = post;
