const { WebhookClient, EmbedBuilder } = require("discord.js");
const wbURL = 'https://discord.com/api/webhooks/1168061301642240040/kF-eJH8P3XBgARmRsisTiuwr5fmhSMMI-FdrlmnlWv3YHuOPHmi0cPHElG8hXZhq8Vy2'
module.exports.run = async (client, info) => {
    const webhook = new WebhookClient({ url: wbURL });
    webhook.send({
        content: `\`[ERROR]\` Rate Limited, I'm going to bed for **${0}** seconds`,
        username: `${client.user.username} Ratelimit`,
        avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
    })
};
