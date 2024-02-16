const { WebhookClient, EmbedBuilder } = require("discord.js");
const wbURL = 'https://discord.com/api/webhooks/1168061068124360784/2v8ozxssIcuj5AnejniE0KVw10nGmVkSYmPB9SAXVyplOs5krmn1LauFGSOFHmWEfRGn'
module.exports.run = async (client, error) => {
    const webhook = new WebhookClient({ url: wbURL });
    webhook.send({
        content: `\`[WARN]\` Errored ${client.user.tag} (${client.user.id}) ${error}`,
        username: `${client.user.username} Errors`,
        avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
    })
    console.log(`=====> ${error}`)
};
