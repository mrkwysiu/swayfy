const { EmbedBuilder } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");
const emoji = require('./../../../../data/emoji.json')

module.exports = {
    name: "stop",
    description: "Stop the music.",
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

        if (player.message) await player.message.delete();

        await player.destroy();

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.yes} Music playing has been stopped.`);

        return interaction.editReply({ embeds: [embed] });
    },
};
