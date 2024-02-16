const { WebhookClient, EmbedBuilder } = require("discord.js");
const wbURL = 'https://discord.com/api/webhooks/1168061718153400390/-4Wl1aZ7YRl-acQuZyWr0gAPqG0x-CiO4PSyoHhEehIF_wHVsiJKsPbJpbndZTzPOfyW'
module.exports.run = async (client, error, id) => {
    console.log(`[WARN] Shard ${id} Shard Resumed!`);
    const webhook = new WebhookClient({ url: wbURL });
    webhook.send({
        content: `\`[WARN]\` Shard **${id}** resumed!`,
        username: `${client.user.username}`,
        avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
    })
};
