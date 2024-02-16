const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionType, WebhookClient } = require("discord.js");
const { supportUrl } = require("../../../settings/config.js");
const emoji = require('./../../../../data/emoji.json')
const Ban = require("../../../settings/models/Ban.js");
const logsURL = 'https://discord.com/api/webhooks/1158190969930383433/W1ZMNtBwhs7cUcD6mb2BnEteH-_k69T1DwqPvgljxe5o8IQAwOlRUYOV9jqUWcw6mDsc'

module.exports.run = async (client, interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        const command = client.slashCommands.get(interaction.commandName);
        const user = client.premium.get(interaction.user.id);

        await client.createInteraction(interaction);

        if (!command) return;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel("Support").setURL(supportUrl).setStyle(ButtonStyle.Link),
        );

        if (client.dev.has(true) && interaction.user.id !== client.owner) {
            return interaction.reply({
                content: `${emoji.no} I'm under maintenance. Sorry for the inconvinience. Thank You!`,
                components: [row],
                ephemeral: true,
            });
        }

        const msg_cmd = [
            `**[SLASH]** ${command.name}`,
            `used by ${interaction.user.tag} (\`${interaction.user.id}\`) in ${interaction.guild.name} (\`${interaction.guild.id}\`)`,
        ];

        //console.log(`${msg_cmd.join(" ")}`);
        const webhook = new WebhookClient({ url: logsURL });
        webhook.send({
            content: `${msg_cmd.join(" ")}`,
            username: `${client.user.username} SLASH Command`,
            avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
        })

        const userBan = await Ban.findOne({ userID: interaction.user.id });

        if (userBan && userBan.isBanned === true && interaction.user.id !== client.owner) {
            return interaction.reply({
                content: `${emoji.no} You are blacklisted, click the button below to appeal.`,
                components: [row],
                ephemeral: true,
            });
        }
        
        //node error wyjebka handling
        
        process.on("unhandledRejection", async (reason, promise) => {
            if(reason.toString() === 'Error: [Poru Error] No nodes are available'){
                const embed = new EmbedBuilder().setColor(client.color).setDescription(`${emoji.no} Sorry, my music server is not responding.`)
        		const row = new ActionRowBuilder()
            		.addComponents(new ButtonBuilder().setLabel("Support").setURL(supportUrl).setStyle(ButtonStyle.Link))
            	return interaction.editReply({ embeds: [embed], components: [row] });
        	}
        })

        //Default Permission
        const botPermissions = ["ViewChannel", "SendMessages", "EmbedLinks"];
        const botMissingPermissions = [];

        for (const perm of botPermissions) {
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(perm)) {
                botMissingPermissions.push(perm);
            }
        }

        if (botMissingPermissions.length > 0) {
            return interaction.reply({
                content: `${emoji.no} I don't have one of these permissions \`ViewChannel\`, \`SendMessages\`, \`EmbedLinks\`.\nPlease double check them in your server role & channel settings.`,
                components: [row],
                ephemeral: true,
            });
        }

        const warning = new EmbedBuilder().setColor(client.color);

        //Check Bot Command Permissions
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(command.permissions.bot || [])) {
            warning.setDescription(`${emoji.no} I don't have permission \`${command.permissions.bot.join(", ")}\` to execute this command.`);

            return interaction.reply({ embeds: [warning], components: [row], ephemeral: true });
        }

        //Check User Permissions
        if (!interaction.member.permissions.has(command.permissions.user || [])) {
            warning.setDescription(
                `${emoji.no} You don't have permission \`${command.permissions.user.join(", ")}\` to execute this command.`,
            );

            return interaction.reply({ embeds: [warning], components: [row], ephemeral: true });
        }

        // Check Player & Current Playing
        let player = client.poru.players.get(interaction.guild.id);
        //Player check
        if (command.settings.player && !player) {
            warning.setDescription(`${emoji.no} There isn't player exists for this server.`);

            return interaction.reply({ embeds: [warning], ephemeral: true });
        }

        //Current Playing Check
        if (command.settings.current && !player.currentTrack) {
            warning.setDescription(`${emoji.no} There isn't any current playing right now.`);

            return interaction.reply({ embeds: [warning], ephemeral: true });
        }

        // Check In Voice & Same Voice Channel
        const { channel } = interaction.member.voice;
        //In Voice Channel Check
        if (command.settings.inVc) {
            if (!channel) {
                warning.setDescription(`${emoji.no} You must be in a voice channel to use this command.`);

                return interaction.reply({ embeds: [warning], ephemeral: true });
            }

            //Bot in Channel Check
            if (
                !interaction.guild.members.cache
                    .get(client.user.id)
                    .permissionsIn(channel)
                    .has(command.permissions.channel || [])
            ) {
                warning.setDescription(
                    `${emoji.no} I don't have permission \`${command.permissions.channel.join(
                        ", ",
                    )}\` to execute this command in this channel.`,
                );

                return interaction.reply({ embeds: [warning], components: [row], ephemeral: true });
            }
        }

        //Same Voice Channel Check
        if (command.settings.sameVc) {
            if (!channel || interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
                warning.setDescription(`${emoji.no} You must be on the same voice channel as me to use this command.`);

                return interaction.reply({ embeds: [warning], ephemeral: true });
            }

            //Bot in Channel Check
            if (
                !interaction.guild.members.cache
                    .get(client.user.id)
                    .permissionsIn(channel)
                    .has(command.permissions.channel || [])
            ) {
                warning.setDescription(
                    `${emoji.no} I don't have permission \`${command.permissions.channel.join(
                        ", ",
                    )}\` to execute this command in this channel.`,
                );

                return interaction.reply({ embeds: [warning], components: [row], ephemeral: true });
            }
        }

        //Check Owner
        if (command.settings.owner && interaction.user.id !== client.owner) {
            warning.setDescription(`${emoji.no} Only my owner can use this command!`);

            return interaction.reply({ embeds: [warning], ephemeral: true });
        }

        //Check Premium
        if (command.settings.premium) {
            if (client.config.disablePremium === false && user && !user.isPremium) {
                warning.setDescription(`${emoji.no} You're not premium user!`);

                return interaction.reply({ embeds: [warning], components: [row], ephemeral: true });
            }
        }

        //Error handling
        try {
            command.run(client, interaction, player);
        } catch (error) {
            console.log(error);

            warning.setDescription(`${emoji.no} Something went wrong.`);

            return interaction.editReply({ embeds: [warning], components: [row] });
        }
    }
};
