const { EmbedBuilder } = require("discord.js");
module.exports = {
    name: "eval",
    description: "Bot eval.",
    category: "Utility",
    aliases: [],
    owner: true,
    run: (client, message) => {
        const content = message.content.split(" ").slice(1).join(" ");

        const result = new Promise((resolve) => resolve(eval(content)));

        return result
            .then((output) => {
                if (typeof output !== "string") {
                    output = require("util").inspect(output, { depth: 0 });
                }
                if (output.includes(client.token)) {
                    output = output.replace(this.client.token, "LOL");
                }
            	const embed = new EmbedBuilder()
                .addFields({ name: "📥 Input", value:  `\`\`\`js\n${content.length > 1024 ? "Too many characters to display." : content}\`\`\`` })
                .addFields({ name: "📤 Output", value:  `\`\`\`js\n${result.length > 1024 ? 'Too many characters to display.' : result}\`\`\`` })
                return message.reply({ embeds: [ embed ]  })
            })
            .catch((err) => {
                err = err.toString();

                if (err.includes(client.token)) {
                    err = err.replace(this.client.token, "xpp");
                }

                return message.reply(err, {
                    code: "js",
                });
            });
    },
};
