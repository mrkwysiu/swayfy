const { EmbedBuilder, WebhookClient, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle, } = require("discord.js");
const wbURL = 'https://discord.com/api/webhooks/1168055319662972999/IUlEFwDjq08drsVioZep7fpHWN7LCn6O6-eS_tcTgM3cwpbEH20oObBY6dn4ntV7STOm'
const emoji = require('./../../../../data/emoji.json')

module.exports.run = async (client, player, track) => {
    if (!player) return;

    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    //console.log(`Error when loading song! Track error is in [${player.guildId}]`);
    const webhook = new WebhookClient({ url: wbURL });
        webhook.send({
            content: `Error when loading song! Track error is in [${player.guildId}]`,
            username: `${client.user.username} Debug`,
            avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
    })

    const row = new ActionRowBuilder()
        .addComponents(new ButtonBuilder().setLabel("Support Server").setURL(supportUrl).setStyle(ButtonStyle.Link))

    if (player.queue.length > 0 || player.queue.size !== 0 ) {
        await player.stop();

        const embed = new EmbedBuilder().setDescription(`${emoji.no} Failed to load the song... I automatically skipped to the next song.`).setColor(client.color);

        return channel.send({ embeds: [embed], components: [row] });
    } else {
        await player.destroy();

        const embed = new EmbedBuilder().setDescription(`${emoji.no} Failed to load the song... I automatically skipped to the next song.`).setColor(client.color);

        return channel.send({ embeds: [embed], components: [row] });
    }
};
