const { EmbedBuilder } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");
const emoji = require('./../../../../data/emoji.json')

module.exports = {
    name: "pause",
    description: "Pause current played song.",
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

        if (!player.isPaused) {
            await player.pause(true);

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.pause} Paused!`);

            return interaction.editReply({ embeds: [embed] });
        } else {
            const commands = await client.application.commands.fetch();
            const cmd = commands.find(cmd => cmd.name === 'resume')?.id;
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.no} Hmm... Song is already paused. Use the </resume:${cmd}> command to resume the song!`);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
