const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const emoji = require('./../../../../data/emoji.json')

module.exports = {
    name: "remove",
    description: "Remove a song from the queue.",
    category: "Music",
    options: [
        {
            name: "position",
            description: "Position of the song.",
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 1,
        },
    ],
    permissions: {
        bot: [],
        channel: [],
        user: [],
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

        const track = interaction.options.getNumber("position");

        if (track > player.queue.length) {
            const commands = await client.application.commands.fetch();
            const cmd = commands.find(cmd => cmd.name === 'queue')?.id;
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.no} I did not find a song in this position, use the </queue:${cmd}> command to display the current song queue.`);

            return interaction.editReply({ embeds: [embed] });
        }

        await player.queue.remove(track - 1);

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.yes} I have removed the given song from the queue.`);

        return interaction.editReply({ embeds: [embed] });
    },
};
