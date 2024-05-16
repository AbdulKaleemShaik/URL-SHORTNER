const mongoose = require("mongoose");
const urlSchema = new mongoose.Schema({
    fullUrl: { type: String, required: true },
    shortId: { type: String, unique: true, required: true },
    clicks: { type: Number, default: 0 }
});
const url = mongoose.model('url', urlSchema);
module.exports = url;