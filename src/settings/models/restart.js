const mongoose = require("mongoose");

const restartCmd = mongoose.Schema({
    finder: { type: String, required: true },
    chnl: { type: String, required: true },
    msg: { type: String, required: true }
});

module.exports = mongoose.model("restartCmd", restartCmd);
