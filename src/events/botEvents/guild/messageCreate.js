const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require("discord.js");
const { supportUrl } = require("../../../settings/config.js");
const logsURL = 'https://discord.com/api/webhooks/1158190969930383433/W1ZMNtBwhs7cUcD6mb2BnEteH-_k69T1DwqPvgljxe5o8IQAwOlRUYOV9jqUWcw6mDsc'

module.exports.run = async (client, message) => {
    //Ignoring bot, system, dm and webhook messages
    if (message.author.bot || !message.guild || message.system || message.webhookId) return;

    await client.createMessage(message);

    let prefix = client.prefix;
    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

    if (message.content.match(mention)) {
        const embed = new EmbedBuilder().setColor(client.color).setDescription(`Hey, i support only slash command - use /help`);

        message.reply({ embeds: [embed] });
    }

    //remove prefix for owner
    // if (client.owner.includes(message.author.id) && !client.owner.includes(client.user.id) && !message.content.startsWith(prefix)) {
    //     prefix = "";
    // }

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);

    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);

    //Finding command from aliases
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (!command) return;

    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Support").setURL(supportUrl).setStyle(ButtonStyle.Link));

    if (client.dev.has(true) && message.author.id !== client.owner) {
        return message.reply({
            content: `<:swayfy_no:1095756602881089648> I'm under maintenance. Sorry for the inconvinience. Thank You!`,
            components: [row],
        });
    }

    const webhook = new WebhookClient({ url: logsURL });
    //console.log(`[PREFIX] ${command.name} used by ${message.author.tag} from ${message.guild.name} (${message.guild.id})`);
    webhook.send({
        content: `\`[PREFIX]\` **${command.name}** used by ${message.author.tag} (\`${message.author.id}\`) in ${message.guild.name} (\`${message.guild.id}\`)\n*Full Command:*\n${message.content}`,
        username: `${client.user.username} PREFIX Command`,
        avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
    })

    //Default Permission
    const botPermissions = ["ViewChannel", "SendMessages", "EmbedLinks"];
    const botMissingPermissions = [];

    for (const perm of botPermissions) {
        if (!message.channel.permissionsFor(message.guild.members.me).has(perm)) {
            botMissingPermissions.push(perm);
        }
    }

    if (botMissingPermissions.length > 0)
        return message.reply({
            content: `<:swayfy_no:1095756602881089648> I don't have one of these permissions \`ViewChannel\`, \`SendMessages\`, \`EmbedLinks\`.\nPlease double check them in your server role & channel settings.`,
            components: [row],
        });

    //Check Owner
    if (command.owner && !client.owner.includes(message.author.id)) {
        return message.reply({ content: `<:swayfy_no:1095756602881089648> Only my owner can use this command!` });
    }

    //Error handling
    try {
        command.run(client, message, args);
    } catch (error) {
        console.log(error);

        return message.reply({ content: `<:swayfy_no:1095756602881089648> Something went wrong.`, components: [row] });
    }
};
