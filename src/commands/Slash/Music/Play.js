const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const formatDuration = require("../../../structures/FormatDuration.js");
const emoji = require('./../../../../data/emoji.json')
function isYouTubeLink(link) {
    return /youtube\.com|youtu\.be/.test(link);
}

module.exports = {
    name: "play",
    description: "Play your favorite song/s!",
    category: "Music",
    options: [
        {
            name: "song",
            description: "Provide song name or url.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    permissions: {
        bot: ["Speak", "Connect"],
        channel: ["Speak", "Connect"],
        user: [],
    },
    settings: {
        inVc: true,
        sameVc: false,
        player: false,
        current: false,
        owner: false,
        premium: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply({ ephemeral: false });

        const song = interaction.options.getString("song");

        const embed = new EmbedBuilder().setColor(client.color);

        if (player && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            embed.setDescription(`${emoji.no} You must be on the same voice channel as me.`)

            return interaction.editReply({ embeds: [embed] });
        }

        if (isYouTubeLink(song)) {
            embed.setDescription(`${emoji.no} YouTube is not supported as a playback source! Just type in the song title or use the link to Spotify/SoundCloud.`)

            return interaction.editReply({ embeds: [embed] });
        }

        let playSource = client.config.playSource;

        const res = await client.poru.resolve({ query: song, source: playSource, requester: interaction.member });
        const { loadType, tracks, playlistInfo } = res;
        
        if(res && res.tracks){
            res.tracks.forEach(track => {
                if (track && track.info) {
                    track.info.requester = interaction.user;
                  }
             });
        }

        if (loadType === "LOAD_FAILED" || loadType === "NO_MATCHES") {
            embed.setDescription(`${emoji.no} Unfortunately, I couldn't find this song :(`);

            return interaction.editReply({ embeds: [embed] });
        }

        if (!player) {
            player = await client.poru.createConnection({
                guildId: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                deaf: true,
            });
        }

        if (player.state !== "CONNECTED") player.connect();

        if (loadType === "PLAYLIST_LOADED") {
            for (const track of tracks) {
                player.queue.add(track);
            }

            embed.setDescription(`${emoji.yes} I have added **[${playlistInfo.name}](${song})** • \`${tracks.length}\` to the queue!`);

            if (!player.isPlaying && !player.isPaused) player.play();
        } else if (loadType === "SEARCH_RESULT" || loadType === "TRACK_LOADED") {
            const track = tracks[0];

            player.queue.add(track);

            embed.setDescription(
                `${emoji.yes} I'm playing **[${track.info.title ? track.info.title : "Unknown"}](${track.info.uri})** • \`${
                    track.info.isStream ? "LIVE" : formatDuration(track.info.length)
                }\` • ${interaction.user}`,
            );

            if (!player.isPlaying && !player.isPaused) player.play();
        }

        await interaction.editReply({ embeds: [embed] });
    },
};
