const BaseCommand = require('../../utils/structures/BaseCommand');
const paginationEmbed = require('discord.js-pagination');

let
cmdGeneral = '',
cmdOwner = '',
cmdNeko = '';

module.exports = class HelpCommand extends BaseCommand {
  constructor() {
    super('help', 'general', [], 'Shows this help page!');
  }

  async run(client, message, args) {
    if(cmdGeneral === '' && cmdOwner === '' && cmdNeko === ''){
      await client.commands.forEach(function(cmdKey, command) {
        if(cmdKey.category === 'general'){
          cmdGeneral += `\`${process.env.DISCORD_BOT_PREFIX}${command}\` - ${cmdKey.description}\n`
        }
        if(cmdKey.category === 'owner'){
          cmdOwner += `\`${process.env.DISCORD_BOT_PREFIX}${command}\` - ${cmdKey.description}\n`
        }
        if(cmdKey.category === 'neko'){
          cmdNeko += `\`${process.env.DISCORD_BOT_PREFIX}${command}\` - ${cmdKey.description}\n`
        }
      })
    }

    const generalHelp = client.resource.embed()
    .setTitle('Aya - General Commands')
    .setColor('#eb3434')
    .setTimestamp()
    .setDescription(
      `${cmdGeneral}\n\n`
      +`**Need more help? Join the support server [here](https://discord.gg/CSJkCGx) or with this link\n<https://discord.gg/CSJkCGx>**`
    )
    const nekoHelp = client.resource.embed()
    .setTitle('Aya - Neko Commands')
    .setColor('#fff700')
    .setTimestamp()
    .setDescription(
      `${cmdNeko}\n\n`
      +`**Need more help? Join the support server [here](https://discord.gg/CSJkCGx) or with this link\n<https://discord.gg/CSJkCGx>**`
    )
    const ownerHelp = client.resource.embed()
    .setTitle('Aya - Owner Commands')
    .setColor('#04ff00')
    .setTimestamp()
    .setDescription(
      `${cmdOwner}\n\n`
      +`**Need more help? Join the support server [here](https://discord.gg/CSJkCGx) or with this link\n<https://discord.gg/CSJkCGx>**`
    )

    let pages = [
      generalHelp,
      nekoHelp,
      ownerHelp
    ];
    await paginationEmbed(message, pages)
  }
}