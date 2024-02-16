const { WebhookClient, EmbedBuilder } = require("discord.js");
const wbURL = 'https://discord.com/api/webhooks/1168060693300383804/-2Gaty3PuoY8z68ggDBrblAao7qVP5APFt1CCOxthyy-hO2OKyV4R4VLdtxZJB8iXBcG'
module.exports.run = async (client) => {
    const webhook = new WebhookClient({ url: wbURL });
    webhook.send({
        content: `\`[WARN]\` Disconnected ${client.user.tag} (${client.user.id})!`,
        embeds: [embed],
        username: `${client.user.username} General`,
        avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
    })
};
