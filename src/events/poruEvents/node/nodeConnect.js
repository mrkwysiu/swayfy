const Reconnect = require("../../../settings/models/247.js");
const { WebhookClient } = require("discord.js");
const wbURL = 'https://discord.com/api/webhooks/1168058348738990151/VztyWB6TipElkBMo3uxifL4ehibu5k20Tg7oGeGBpvXxIhjq9M-PdbYt9SQl3qNpNpd3'

module.exports.run = async (client, node) => {
    const webhook = new WebhookClient({ url: wbURL });
    webhook.send({
        content: `\`[INFO]\` Node **${node.name}** is ready!`,
        username: `${client.user.username} LavaLink`,
        avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
    })

    // This will auto reconnect when bot started or has been restarted
    const maindata = await Reconnect.find();

    if (maindata.length === 0) return;

    for (let data of maindata) {
        const index = maindata.indexOf(data);

        setTimeout(async () => {
            const channels = client.channels.cache.get(data.text);
            const voices = client.channels.cache.get(data.voice);

            if (!channels || !voices || !data) return;

            await client.poru.createConnection({
                guildId: data.guild,
                voiceChannel: data.voice,
                textChannel: data.text,
                deaf: true,
            });

            console.log(`[INFO] Auto ReConnect found in ${maindata.length} servers!`);
            webhook.send({
                content: `\`[INFO]\` Auto ReConnect found in ${maindata.length} servers.`,
                username: `${client.user.username} LavaLink`,
                avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
        })
        }),
            index * 5000;
    }
    //
};
