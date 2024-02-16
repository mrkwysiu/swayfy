const { EmbedBuilder } = require("discord.js");
const formatDuration = require("../../../structures/FormatDuration.js");
const GControl = require("../../../settings/models/Control.js");
const capital = require("node-capitalize");
const emoji = require('./../../../../data/emoji.json')

module.exports = {
    name: "nowplaying",
    description: "What are we currently listening to?",
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
        await interaction.deferReply({ ephemeral: false });

        if (!player.currentTrack) return;

        try {
            const Titles =
                player.currentTrack.info.title.length > 20
                    ? player.currentTrack.info.title.substr(0, 20) + "..."
                    : player.currentTrack.info.title;
            const Author =
                player.currentTrack.info.author.length > 20
                    ? player.currentTrack.info.author.substr(0, 20) + "..."
                    : player.currentTrack.info.author;
            const currentPosition = formatDuration(player.position);
            const trackDuration = formatDuration(player.currentTrack.info.length);
            const playerDuration = player.currentTrack.info.isStream ? "LIVE" : trackDuration;
            const currentAuthor = player.currentTrack.info.author ? Author : "Unknown";
            const currentTitle = player.currentTrack.info.title ? Titles : "Unknown";
            const Part = Math.floor((player.position / player.currentTrack.info.length) * 30);
            const Emoji = player.isPlaying ? "🕒 |" : "⏸ |";

            let sources = "Unknown";

            if (player.currentTrack.info.sourceName === "soundcloud") sources = "SoundCloud";
            else if (player.currentTrack.info.sourceName === "spotify") sources = "Spotify";
            else if (player.currentTrack.info.sourceName === "apllemusic") sources = "Apple Music";
            else if (player.currentTrack.info.sourceName === "bandcamp") sources = "Bandcamp";
            else if (player.currentTrack.info.sourceName === "http") sources = "HTTP";

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: player.isPlaying ? `Now Playing` : `Song Paused`,
                    iconURL: "https://cdn.swayfy.xyz/swayfy_logo_spin.gif",
                })
                .setThumbnail(player.currentTrack.info.image)
                .setDescription(`**[${currentTitle}](${player.currentTrack.info.uri})**`)
                .addFields([
                    { name: `Author:`, value: `${currentAuthor}`, inline: true },
                    { name: `Requested By:`, value: `${player.currentTrack.info.requester}`, inline: true },
                    { name: `Source:`, value: `${sources}`, inline: true },
                    { name: `Duration:`, value: `${playerDuration}`, inline: true },
                    { name: `Volume:`, value: `${player.volume}%`, inline: true },
                    { name: `Queue Left:`, value: `${player.queue.length}`, inline: true },
                    {
                        name: `Song Progress: \`[${currentPosition}]\``,
                        value: `\`\`\`${Emoji} ${"─".repeat(Part) + "🔵" + "─".repeat(30 - Part)}\`\`\``,
                        inline: false,
                    },
                ])
                .setColor(client.color)
                .setFooter({ text: `${client.user.username}` })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            //console.log(error);
            return interaction.reply({ content: `${emoji.no} Nothing is playing right now.`, ephemeral: true });
        }
    },
};
