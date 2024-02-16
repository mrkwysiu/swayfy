const { EmbedBuilder } = require("discord.js");
const db = require("../../../settings/models/betaServers.js");

module.exports = {
    name: "beta",
    description: "Beta commands.",
    category: "Dev",
    aliases: ["dev"],
    owner: true,
    run: async (client, message, args) => {
        let mode = args[0]
        let type = args[1]
        let id = args[2]

        //console.log(`${mode} | ${type} | ${id}`)
        const node = client.poru.leastUsedNodes;

        if(mode === 'wl'){
            if(type === 'add'){
                if(!id){
                    return message.reply({ content: `<:swayfy_no:1095756602881089648> You need to provide some ID.`})
                }
                if(/^\d+$/.test(id)){
                    const newData = new db({
                        srvID: id
                    })
                    newData.save()
                    return message.reply({ content: `<:swayfy_yes:1095756941113954427> Successfully added!` })
                }else{
                    return message.reply({ content: `<:swayfy_no:1095756602881089648> Incorrect ID!` })
                }
            }else if(type === 'remove'){
                if(!id){
                    return message.reply({ content: `<:swayfy_no:1095756602881089648> You need to provide some ID.`})
                }
                if(/^\d+$/.test(id)){
                    const check = await db.findOne({
                        srvID: id
                    })

                    if(!check){
                        return message.reply({ content: `<:swayfy_no:1095756602881089648> This server is not whitelisted!` })
                    }else{
                        await db.findOneAndRemove({
                            srvID: id
                        })
                        return message.reply({ content: `<:swayfy_yes:1095756941113954427> Successfully removed provided server from Beta Whitelist!` })
                    }
                }
            }else if(type === 'list'){
                var count = 0
                const getSrvs = await db.find()
                const allSrvs = Array.from(getSrvs)

                let list = []

                for(let i = 0; i < allSrvs.length; i++){
                    const srv = allSrvs[i]
                    list.push(`\`${srv.srvID}\``)
                }

                count = allSrvs.length
                const embed = new EmbedBuilder()
                    .setTitle('All servers with access to the BETA')
                    .addFields({ name: `Server count`, value: `\`${count}\`` })
                    .setFooter({ text: `Swayfy BETA`, iconURL: client.user.displayAvatarURL({ size: 2048, dynamic: false }) })
                    .setTimestamp()
                embed.setDescription(`${list.join(`, `) ? list.join(`, `) : 'There is no whitelisted servers yet.'}`)

                return message.reply({ embeds: [embed] })
            }else{
                return message.reply({ content: `<:swayfy_no:1095756602881089648> Incorrect command usage!\nCorrect form: \`?beta wl/players add/remove/list (id)\`` })
            }
        }else if(mode === 'players'){
            return message.reply({ content: `Currently running players \`-\` ${node.stats.players}` })
        }else if(mode === 'srv'){
            if(type === 'list'){
                const getPage = id
                const serverEmbed = new EmbedBuilder()
                .setTitle("Servers List")
                .setColor("#ffdd00");

                let serverList = "";
                const guilds = Array.from(client.guilds.cache.values());
                const pageSize = 10;
                let page = 0;

                if (getPage && !isNaN(getPage)) {
                    page = getPage - 1;
                }
                let totalPages = Math.ceil(guilds.length / pageSize);
                if(getPage > totalPages){
                    return message.reply({ content: `There is onyl \`${totalPages}\` pages. Please provide correct page.`, ephemeral: true })
                }
                serverList = guilds
                    .slice(page * pageSize, (page + 1) * pageSize)
                    .map(guild => `${guild.name} ┃ \`${guild.id}\` ┃ \`${guild.memberCount}\`\n`)
                    .join("");
                serverEmbed.setDescription(serverList);

                serverEmbed.setFooter({ text: `Page ${page + 1}/${totalPages}  •  Servers: ${client.guilds.cache.size}` });

                message.reply({ embeds: [serverEmbed] })
            }else if(type === 'info'){
                if(!id) return message.reply({ content: `Please provide some server ID` })
                const gg = await await client.guilds.fetch(id)
                if(!gg) return message.reply({ content: ':x: Im not on pointed server'})

                const own = await gg.fetchOwner()

                const embed = new EmbedBuilder()
                    .setColor('#ffdd00')
                    .setTitle(gg.name)
                    .addFields({ name: `👑 Owner`, value: `${own} \`${own.user.id}\``, inline: true })
                    .addFields({ name: `<:swayfy_users:1153073495631208469> Member Count`, value: `${gg.memberCount}`, inline: true })
                    .setThumbnail(gg.iconURL())
                
                if(gg.description){
                    embed.setDescription(gg.description)
                }

                message.reply({ embeds: [embed] })
            }else if(type === 'inv'){
                if(!id) return message.reply({ content: `Please provide some server ID` })
                const serverTarget = await client.guilds.cache.get(id)
                if(!serverTarget) {
                    return message.reply({ content: `You provided wrong ID or im not on pointed server.` })
                }

                try {
                    const invite = await serverTarget.channels.cache
                        .filter((channel) => channel.type === 0)
                        .first()
                        .createInvite({ unique: true, maxAge: 10*60*1000, maxUses: 1 });
                    if(!invite) return message.reply('Nie znaleziono kanału do utworzenia zaproszenia.');
        
                    return message.reply({ content: `Here you go! ${invite.url}` })
                } catch (error) {
                        const errEmbed = new EmbedBuilder()
                            .setColor('#ff0015')
                            .setDescription(`\`${error}\``)
                            message.reply({ content: '<a:UWAGA_red:1007635901142286466> For some reason i cant create a invite link, probably i don\'t have necessary permission to do that.', embeds: [ errEmbed ] })
                        return
                }
            }else if(type === 'leave'){
                if(!id) return message.reply({ content: `Please provide some server ID` })
                const serverTarget = await client.guilds.cache.get(id)
                if(!serverTarget) {
                    return message.reply({ content: `You provided wrong ID or im not on pointed server.` })
                }
                serverTarget.leave('Bot owners request me to leave from this sever. For more informations join to my support server.')
                message.reply({ content: `<:swayfy_yes:1095756941113954427> Successfully leaved.` })
            }
        }else{
            return message.reply({ content: `<:swayfy_no:1095756602881089648> Incorrect command usage!\nCorrect form: \`?beta wl/players/srv add/remove/list/info/inv/leave (id)\`` })
        }
    },
};
