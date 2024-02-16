const { WebhookClient, EmbedBuilder } = require("discord.js");
const wbURL = 'https://discord.com/api/webhooks/1168061718153400390/-4Wl1aZ7YRl-acQuZyWr0gAPqG0x-CiO4PSyoHhEehIF_wHVsiJKsPbJpbndZTzPOfyW'
const { ClusterManager } = require("discord-hybrid-sharding"); 
require("dotenv").config();

const manager = new ClusterManager(`${__dirname}/index.js`, {
    totalShards: "auto", 
    shardsPerClusters: 6, 
    totalClusters: "auto", 
    mode: "process", 
    token: process.env.TOKEN, 
});

const webhook = new WebhookClient({ url: wbURL });

manager.on("clusterCreate", (cluster) => {
    console.log(`[INFO] Launched Cluster ${cluster.id}`)
    webhook.send({
        content: `\`[INFO]\` Launched Cluster **${cluster.id}**`,
        username: `Swayfy`,
        //avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`,
    })
})
manager.spawn({ timeout: -1 });
