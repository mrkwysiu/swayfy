const { EmbedBuilder } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");
const emoji = require('./../../../../data/emoji.json')

module.exports = {
    name: "resume",
    description: "Resume the paused song.",
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

        if (player.isPaused) {
            await player.pause(false);

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.yes} Resumed!`);

            return interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.yes} The song is not paused.`);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
