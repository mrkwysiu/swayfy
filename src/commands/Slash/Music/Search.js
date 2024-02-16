const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ApplicationCommandOptionType } = require("discord.js");
const formatDuration = require("../../../structures/FormatDuration.js");
const emoji = require('./../../../../data/emoji.json')

module.exports = {
    name: "search",
    //id: "1055080810992111652",
    description: "Search for your favorite song.",
    category: "Music",
    options: [
        {
            name: "song",
            description: "Provide song name you want to search.",
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
        const query = interaction.options.getString("song");

        if (player && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            const warning = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${emoji.no} You must be on the same voice channel as me.`)

            return interaction.reply({ embeds: [warning], ephemeral: true });
        }

        if (/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(query)) {
            const commands = await client.application.commands.fetch();
            const cmd = commands.find(cmd => cmd.name === 'play')?.id;
            const embed = new EmbedBuilder()
                .setDescription(`${emoji.no} Please use </play:${cmd}> command for url search.`)
                .setColor(client.color);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: false });

        let playSource = client.config.playSource;

        const res = await client.poru.resolve({ query: query, source: playSource, requester: interaction.user });
        const { tracks } = res;

        const results = tracks.slice(0, 10);

        let n = 0;

        const str = tracks
            .slice(0, 10)
            .map(
                (r) =>
                    `\`${++n}.\` **[${r.info.title.length > 20 ? r.info.title.substr(0, 25) + "..." : r.info.title}](${r.info.uri})** • ${
                        r.info.author
                    }`,
            )
            .join("\n");

        const selectMenuArray = [];

        for (let i = 0; i < results.length; i++) {
            const track = results[i];

            let label = `${i + 1}. ${track.info.title}`;

            if (label.length > 50) label = label.substring(0, 47) + "...";

            selectMenuArray.push({
                label: label,
                description: track.info.author,
                value: i.toString(),
            });
        }

        const selection = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("search")
                .setPlaceholder("Please select your song here")
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(selectMenuArray),
        ]);

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Seach Selection Menu", iconURL: interaction.member.displayAvatarURL({}) })
            .setDescription(str)
            .setColor(client.color)
            .setFooter({ text: `You have 30 seconds to make your selection through the dropdown menu.` });

        await interaction.editReply({ embeds: [embed], components: [selection] }).then((message) => {
            let count = 0;

            const selectMenuCollector = message.createMessageComponentCollector({ time: 30000 });
            const toAdd = [];

            try {
                selectMenuCollector.on("collect", async (menu) => {
                    if (menu.user.id !== interaction.member.id) {
                        const unused = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.no} This menu was opened by ${interaction.member}, you cannot use it.`);

                        return menu.reply({ embeds: [unused], ephemeral: true });
                    }

                    menu.deferUpdate();

                    if (!player) {
                        player = await client.poru.createConnection({
                            guildId: interaction.guild.id,
                            voiceChannel: interaction.member.voice.channel.id,
                            textChannel: interaction.channel.id,
                            deaf: true,
                        });
                    }

                    if (player.state !== "CONNECTED") player.connect();

                    for (const value of menu.values) {
                        toAdd.push(tracks[value]);
                        count++;
                    }

                    for (const track of toAdd) {
                        player.queue.add(track);
                    }

                    const track = toAdd.shift();
                    const trackTitle = track.info.title.length > 15 ? track.info.title.substr(0, 15) + "..." : track.info.title;

                    const tplay = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${emoji.plus} | **[${trackTitle ? trackTitle : "Unknown"}](${track.info.uri})** • \`${
                                track.info.isStream ? "LIVE" : formatDuration(track.info.length)
                            }\` • ${interaction.user}`,
                        );

                    await message.edit({ embeds: [tplay], components: [] });
                    if (!player.isPlaying && !player.isPaused) return player.play();
                });

                selectMenuCollector.on("end", async (collected) => {
                    if (!collected.size) {
                        const timed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.no} Search was time out.`);

                        return message.edit({ embeds: [timed], components: [] });
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });
    },
};
