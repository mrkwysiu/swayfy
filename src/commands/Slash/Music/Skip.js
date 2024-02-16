const { EmbedBuilder } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");
const emoji = require('./../../../../data/emoji.json')

module.exports = {
    name: "skip",
    description: "Skip the current played song.",
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

        if (!player || player.queue.size == 0) {
            const embed = new EmbedBuilder().setDescription(`${emoji.no} This is the end of the queue! There is no more songs to be played.`).setColor(client.color);

            return interaction.editReply({ embeds: [embed] });
        } else {
            await player.stop();

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.next} Skipped!`);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
