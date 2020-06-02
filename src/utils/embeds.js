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
    }
}