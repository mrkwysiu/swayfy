const { ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const db = require("../../../settings/models/betaServers.js");
const logs = '1157103002306490408'

module.exports.name = 'guildCreate'
module.exports.run = async (client, guild) => {
    const name = module.exports.name
    const chnl = await client.channels.cache.get(logs);
    const server = guild.id

    const check = await db.findOne({ srvID: server })

    if(!check){
        chnl.send(`Leaved from guild ${guild.id}. This server is not whitelisted`)
        guild.leave()
    }else{
        return chnl.send(`I have been added to new guild (${guild.id})`)
    }
};
