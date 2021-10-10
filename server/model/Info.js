const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const config = require("../config/key");
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
  category: String,
  categoryId: String,
  team: String,
});

infoSchema.plugin(encrypt, {
  secret: config.secret,
  encryptedFields: ["accessToken", "secretKey"],
});

const Info = mongoose.model("Info", infoSchema);

module.exports = { Info };
