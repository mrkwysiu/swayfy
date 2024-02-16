const Reconnect = require("../../../settings/models/247.js");
const { WebhookClient } = require("discord.js");
const wbURL = 'https://discord.com/api/webhooks/1168055319662972999/IUlEFwDjq08drsVioZep7fpHWN7LCn6O6-eS_tcTgM3cwpbEH20oObBY6dn4ntV7STOm'
const emoji = require('./../../../../data/emoji.json')

module.exports.run = async (client, player) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    // If 247 activated, this will auto connect voice when bot disconnected/destoryed
    const data = await Reconnect.findOne({ guild: player.guildId });

    if (data) {
        if (player.state !== "DESTROYING") {
            await client.poru.createConnection({
                guildId: data.guild,
                voiceChannel: data.voice,
                textChannel: data.text,
                deaf: true,
            });
        }
    }
    //

    const webhook = new WebhookClient({ url: wbURL });
        webhook.send({
            content: `Player Destroyed from (${player.guildId})`,
            username: `${client.user.username} Debug`,
            avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
    })
};
