const Discord = require(`discord.js`);

module.exports = (client) = {
    
    embed(color) {
        const embed = new Discord.MessageEmbed()
        .setTimestamp()
        if (color) {
            embed
            .setColor(`${color}`)
        }
        return embed;
    },
    loading(){
        const embed = new Discord.MessageEmbed()
        .setTitle(`Loading data<a:embed_loading:695358635110301726>`)
        .setURL(`https://discord.gg/CSJkCGx`);
        return embed
    },
    leave(guild){
        const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`Left Guild!`)
        .addField(`Guild Name`, guild.name, false)
        .addField(`Guild ID`, guild.id, false)
        .addField(`Member Count`, guild.memberCount - 1, true)
        .addField("Humans", `${guild.members.cache.filter(member => !member.user.bot).size} `, true)
        .addField("Bots", `${guild.members.cache.filter(member => member.user.bot).size}` - 1, true)
        .addField(`Owner`, `${guild.owner.user.tag}[${guild.owner.id}]`, false)
        return embed
    },
    join(guild){
        const embed = new Discord.MessageEmbed()
        .setColor('#26ff00')
        .setTitle(`Join Guild!`)
        .addField(`Guild Name`, guild.name, false)
        .addField(`Guild ID`, guild.id, false)
        .addField(`Member Count`, guild.memberCount - 1, true)
        .addField("Humans", `${guild.members.cache.filter(member => !member.user.bot).size} `, true)
        .addField("Bots", `${guild.members.cache.filter(member => member.user.bot).size}` - 1, true)
        .addField(`Owner`, `${guild.owner.user.tag}[${guild.owner.id}]`, false)
        return embed
    },
    sendLive(client, channelid, name, body){
        client.channels.cache.get(channelid).send(
            new Discord.MessageEmbed()
            .setColor('#d2eb34')
            .setTitle(`${name}`)
            .setURL(`https://discord.gg/CSJkCGx`)
            .setDescription(`\`\`\`js\n${body}\n\`\`\``)
        );
    }
}