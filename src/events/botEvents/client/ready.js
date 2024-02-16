const { ActivityType, EmbedBuilder, WebhookClient } = require("discord.js");
const User = require("../../../settings/models/User.js");
const db = require("./../../../settings/models/restart.js")
const wbURL = 'https://discord.com/api/webhooks/1168061718153400390/-4Wl1aZ7YRl-acQuZyWr0gAPqG0x-CiO4PSyoHhEehIF_wHVsiJKsPbJpbndZTzPOfyW'

module.exports.run = async (client) => {
    await client.poru.init(client, {
        shards: client.cluster.info.TOTAL_SHARDS,
        clientName: client.user.username,
        clientId: client.user.id,
    });

    const getDB = await db.findOne({
        finder: 'aa'
    })

    if(getDB){
        const editMsgChnl = await client.channels.cache.get(getDB.chnl)
        const editMsg = await editMsgChnl.messages.fetch(getDB.msg)
        const embed = new EmbedBuilder()
            .setDescription(`<:swayfy_yes:1095756941113954427> Successfully restarted!`)
            .setColor(client.color);
        editMsg.edit({ embeds: [embed] })
        await db.findOneAndRemove({ finder: 'aa' })
    }

    const users = await User.find();

    await users.forEach(async (user) => {
        client.premium.set(user.Id, user);
    });

    setInterval(async () => {
        const promises = [
            client.cluster.broadcastEval("this.guilds.cache.size"),
            client.cluster.broadcastEval((c) => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
        ];

        const results = await Promise.all(promises);

        const servers = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
        const members = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

        const status = [
            // { type: ActivityType.Playing, name: "/play" },
            // { type: ActivityType.Watching, name: `${members} Users` },
            // { type: ActivityType.Competing, name: `${servers} Servers` },
            { type: ActivityType.Custom, name: `🎵 What do we listen to today?`}
        ];

        const index = Math.floor(Math.random() * status.length);

        await client.user.setActivity(status[index].name, { type: status[index].type });
    }, 5000);

    const webhook = new WebhookClient({ url: wbURL });
    webhook.send({
        content: `\`[INFO]\` I'm ready with ${client.guilds.cache.size} servers`,
        username: `${client.user.username}`,
        avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
    })
};
