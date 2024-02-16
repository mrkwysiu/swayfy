const { EmbedBuilder } = require("discord.js");
const emoji = require('./../../../../data/emoji.json')

module.exports = {
    name: "clear-queue",
    description: "Clear the queue from all songs.",
    category: "Music",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: false,
        sameVc: true,
        player: true,
        current: false,
        owner: false,
        premium: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply({ ephemeral: true });

        if (!player.queue.length) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.no} The queue is already empty.`);

            return interaction.editReply({ embeds: [embed] });
        } else {
            const { length } = player.queue;

            await player.queue.clear();

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.yes} Successfully cleared the queue of **${length}** tracks!`);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
