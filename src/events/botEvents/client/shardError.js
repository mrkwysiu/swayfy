const { WebhookClient, EmbedBuilder } = require("discord.js");
const wbURL = 'https://discord.com/api/webhooks/1168061718153400390/-4Wl1aZ7YRl-acQuZyWr0gAPqG0x-CiO4PSyoHhEehIF_wHVsiJKsPbJpbndZTzPOfyW'
module.exports.run = async (client, error, id) => {
    const webhook = new WebhookClient({ url: wbURL });
    const embed = new EmbedBuilder().setDescription(`${error ? error : 'This error cannot be displayed'}`).setColor('#ff0000')
    webhook.send({
        content: `\`[WARN]\` Shard **${id}** got an error!`,
        embeds: [embed],
        username: `${client.user.username}`,
        avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
    })
};
