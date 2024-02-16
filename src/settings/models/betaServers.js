const mongoose = require("mongoose");

const betaServers = mongoose.Schema({
    srvID: { type: String, required: true }
});

module.exports = mongoose.model("betaServers", betaServers);
