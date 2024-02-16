const { EmbedBuilder } = require("discord.js");
const emoji = require('./../../../../data/emoji.json')

module.exports = {
    name: "disconnect",
    description: "Force the bot to left voice channel.",
    category: "Music",
    permissions: {
        bot: [],
        channel: [],
        user: ["ManageGuild"],
    },
    settings: {
        inVc: true,
        sameVc: true,
        player: true,
        current: false,
        owner: false,
        premium: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply({ ephemeral: true });

        if (player.message) await player.message.delete();

        await player.destroy();

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.yes} I successfully left the voice channel, see you soon!`);

        return interaction.editReply({ embeds: [embed] });
    },
};
