const BaseCommand = require('../../utils/structures/BaseCommand');
const paginationEmbed = require('discord.js-pagination');

let
cmdGeneral = '',
cmdOwner = '',
cmdNeko = '',
cmdMusic = '';

let moreHelp = `**Need more help? Join the support server [here](https://discord.gg/CSJkCGx) or with this link\n<https://discord.gg/CSJkCGx>**`;

module.exports = class HelpCommand extends BaseCommand {
  constructor() {
    super('help', 'general', [], 'Shows this help page!');
  }

  async run(client, message, args) {
    if(cmdGeneral === '' && cmdOwner === '' && cmdNeko === '' && cmdMusic === ''){
      await client.commands.forEach(function(cmdKey, command) {
        if(cmdKey.category === 'general'){
          cmdGeneral += `\`${process.env.DISCORD_BOT_PREFIX}${command}\` **Alias: [${cmdKey.aliases.toString()}]** - ${cmdKey.description}\n`
        }
        if(cmdKey.category === 'owner'){
          cmdOwner += `\`${process.env.DISCORD_BOT_PREFIX}${command}\` **Alias: [${cmdKey.aliases.toString()}]** - ${cmdKey.description}\n`
        }
        if(cmdKey.category === 'neko'){
          cmdNeko += `\`${process.env.DISCORD_BOT_PREFIX}${command}\` **Alias: [${cmdKey.aliases.toString()}]** - ${cmdKey.description}\n`
        }
        if(cmdKey.category === 'music'){
          cmdMusic += `\`${process.env.DISCORD_BOT_PREFIX}${command}\` **Alias: [${cmdKey.aliases.toString()}]** - ${cmdKey.description}\n`
        }
      })
    }

    const generalHelp = client.resource.embed()
    .setTitle('Aya - General Commands')
    .setColor('#eb3434')
    .setTimestamp()
    .setDescription(`${cmdGeneral}\n\n${moreHelp}`)
    
    const nekoHelp = client.resource.embed()
    .setTitle('Aya - Neko Commands')
    .setColor('#fff700')
    .setTimestamp()
    .setDescription(`${cmdNeko}\n\n${moreHelp}`)

    const ownerHelp = client.resource.embed()
    .setTitle('Aya - Owner Commands')
    .setColor('#04ff00')
    .setTimestamp()
    .setDescription(`${cmdOwner}\n\n${moreHelp}`)

    const musicHelp = client.resource.embed()
    .setTitle('Aya - Music Commands')
    .setColor('#04ff00')
    .setTimestamp()
    .setDescription(`${cmdMusic}\n\n${moreHelp}`)

    let pages = [
      generalHelp,
      nekoHelp,
      ownerHelp,
      musicHelp
    ];
    if(!args[0]){
      await paginationEmbed(message, pages)
    }
    else if(args[0].toLowerCase() === `music`){
      return message.channel.send(musicHelp)
    }
    else if(args[0].toLowerCase() === `owner`){
      return message.channel.send(ownerHelp)
    }
    else if(args[0].toLowerCase() === `neko`){
      return message.channel.send(nekoHelp)
    }
    else if(args[0].toLowerCase() === `general`){
      return message.channel.send(generalHelp)
    }
    
  }
}