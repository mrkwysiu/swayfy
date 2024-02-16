require("dotenv").config();
const { customFilter } = require("poru");
const { Spotify } = require("poru-spotify");

const spotify = new Spotify({
    clientID: process.env.SPOTIFY_ID || " ",
    clientSecret: process.env.SPOTIFY_SECRET || " ",
});

module.exports = {
    // BOT DETAILS
    token: process.env.TOKEN || " ", 
    prefix: process.env.PREFIX || "!", 
    color: process.env.EMBED_COLOR || " ", 
    owner: process.env.OWNER_ID || " ", 
    guildLogs: process.env.GUILD_LOGS || " ", 
    leaveTimeout: process.env.LEAVE_TIMEOUT || "60000*5", // 1000 = 1sec
    disablePremium: parseBoolean(process.env.DISABLE_PREMIUM || "false"), 
    logoSpin: 'https://cdn.swayfy.xyz/swayfy_logo_spin.gif',

    // PORU DETAILS
    playSource: process.env.PLAY_SOURCE || "spotify", //  "ytsearch" / "ytmsearch" / "scsearch" / "spotify"
    poruOptions: {
        customFilter,
        library: "discord.js", 
        plugins: [spotify], 
        reconnectTries: Infinity, 
        reconnectTimeout: 10000, // 1000 = 1sec
    },
    nodes: [
        {
            name: process.env.NODE_NAME, 
            host: process.env.NODE_HOST, 
            port: parseInt(process.env.NODE_PORT),
            password: process.env.NODE_PASSWORD , 
            secure: parseBoolean(process.env.NODE_SECURE), 
        },
    ],

    // LINK DETAILS
    mongoUri: process.env.MONGO_URI || " ", 
    supportUrl: process.env.SUPPORT_URL || "", 
    inviteUrl: process.env.INVITE_URL || " ", 
    imageUrl: process.env.IMAGE_URL || " ", 
};

function parseBoolean(value) {
    if (typeof value === "string") {
        value = value.trim().toLowerCase();
    }
    switch (value) {
        case true:
        case "true":
            return true;
        default:
            return false;
    }
}
