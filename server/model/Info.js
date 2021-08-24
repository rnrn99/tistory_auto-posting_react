const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const infoSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  appId: String,
  secretKey: String,
  redirectUri: String,
  code: String,
  accessToken: String,
});

const Info = mongoose.model("Info", infoSchema);

module.exports = { Info };
