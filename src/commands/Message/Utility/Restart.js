const { EmbedBuilder } = require("discord.js");
const db = require("../../../settings/models/restart.js");

module.exports = {
    name: "restart",
    description: "Shuts down the client!",
    category: "Utility",
    aliases: ["reboot"],
    owner: true,
    run: async (client, message) => {
        const embed = new EmbedBuilder().setDescription(`<:swayfy_reload:1153170807560867910> Bot is: \`Restarting\``).setColor(client.color);

        const msg = await message.reply({ embeds: [embed] })

        const chnlID = msg.channel.id
        const msgID = msg.id

        const newData = new db({
            finder: 'aa',
            chnl: chnlID,
            msg: msgID
        })
        await newData.save()

        process.exit();
    },
};
