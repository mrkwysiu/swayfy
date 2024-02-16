const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");
const emoji = require('./../../../../data/emoji.json')

module.exports = {
    name: "loop",
    description: "Enable the Loop mode.",
    category: "Music",
    options: [
        {
            name: "mode",
            description: "Choose loop mode.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Current Song",
                    value: "current",
                },
                {
                    name: "Queue",
                    value: "queue",
                },
            ],
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
        current: true,
        owner: false,
        premium: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply({ ephemeral: true });

        const input = interaction.options.getString("mode");

        if (input === "current") {
            if (player.loop === "TRACK") {
                await player.setLoop("NONE");

                const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.loop} Loop mode has been \`Disabled\``)

                return interaction.editReply({ embeds: [embed] });
            } else {
                await player.setLoop("TRACK");

                const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.loop} Loop mode has been set to \`Current Song\``).setFooter({ text: `Use this command again to disable loop mode` })

                return interaction.editReply({ embeds: [embed] });
            }
        } else if (input === "queue") {
            if (player.loop === "QUEUE") {
                await player.setLoop("NONE");

                const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.loop} Loop mode has been \`Disabled\``);

                return interaction.editReply({ embeds: [embed] });
            } else {
                player.setLoop("QUEUE");

                const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.loop} Loop mode has been set to \`Queue\``).setFooter({ text: `Use this command again to disable loop mode` })

                return interaction.editReply({ embeds: [embed] });
            }
        }
    },
};
