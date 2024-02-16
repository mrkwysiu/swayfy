const { WebhookClient, EmbedBuilder } = require("discord.js");
const wbURL = 'https://discord.com/api/webhooks/1168060693300383804/-2Gaty3PuoY8z68ggDBrblAao7qVP5APFt1CCOxthyy-hO2OKyV4R4VLdtxZJB8iXBcG'
module.exports.run = async (client) => {
    console.log(`[WARN] Warned ${client.user.tag} (${client.user.id})`);
    const webhook = new WebhookClient({ url: wbURL });
    webhook.send({
        content: `\`[WARN]\` Warned ${client.user.tag} (${client.user.id})`,
        username: `${client.user.username}`,
        avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
    })
};
