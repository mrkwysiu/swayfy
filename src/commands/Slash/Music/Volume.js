const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const GControl = require("../../../settings/models/Control.js");
const emoji = require('./../../../../data/emoji.json')

module.exports = {
    name: "volume",
    description: "Change the volume.",
    category: "Music",
    options: [
        {
            name: "amount",
            description: "The number of volume which you want to set.",
            type: ApplicationCommandOptionType.Number,
            required: false,
            min_value: 1,
            max_value: 100,
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

        const value = interaction.options.getNumber("amount");

        if (!value) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.volup} Current volume **${player.volume}%**.`);

            return interaction.editReply({ embeds: [embed], ephemeral: true });
        } else {
            await player.setVolume(value);

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.volup} Volume changed to: **${value}%**.`);

            return interaction.editReply({ embeds: [embed], ephemeral: true });
        }
    },
};
