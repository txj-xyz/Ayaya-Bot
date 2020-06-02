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
        const embed = new Discord.MessageEmbed().setTitle(`Loading data...`);
        return embed
    }
}