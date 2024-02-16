const { WebhookClient, EmbedBuilder } = require("discord.js");
const wbURL = 'https://discord.com/api/webhooks/1168058348738990151/VztyWB6TipElkBMo3uxifL4ehibu5k20Tg7oGeGBpvXxIhjq9M-PdbYt9SQl3qNpNpd3'
module.exports.run = (client, node, error) => {
    const embed = new EmbedBuilder().setDescription(`${error}`).setColor('#ff0000')
    const webhook = new WebhookClient({ url: wbURL });
    webhook.send({
        content: `\`[ERROR]\` Node **${node.name}** got an error!`,
        embeds: [embed],
        username: `${client.user.username} LavaLink`,
        avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
    })
};
