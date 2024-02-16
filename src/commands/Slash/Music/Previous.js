const { EmbedBuilder } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");
const emoji = require('./../../../../data/emoji.json')

module.exports = {
    name: "previous",
    description: "Return to the previous song.",
    category: "Music",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: true,
        sameVc: true,
        player: true,
        current: true,
        owner: false,
        premium: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply({ ephemeral: true });

        if (!player.previousTrack) {
            const embed = new EmbedBuilder().setDescription(`${emoji.no} Sorry but I forgot what the previous song was so I can't play it.`).setColor(client.color);

            return interaction.editReply({ embeds: [embed] });
        }

        await player.queue.unshift(player.previousTrack);
        await player.stop();

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.yes} I'm playing the previous song.`);

        return interaction.editReply({ embeds: [embed] });
    },
};
