const BaseCommand = require('../../utils/structures/BaseCommand');

let
cmdGeneral = '',
cmdOwner = '',
cmdNeko = '';

module.exports = class HelpCommand extends BaseCommand {
  constructor() {
    super('help', 'general', [], 'Shows this help page!');
  }

  async run(client, message, args) {
    let loading = await message.channel.send(client.resource.loading())
    await client.commands.forEach(function(cmdKey, command) {
      console.log(cmdKey, command)
      if(cmdKey.category === 'general'){
        cmdGeneral += `\`${process.env.DISCORD_BOT_PREFIX}${command}\` - ${cmdKey.description}\n`
      }
      else if(cmdKey.category === 'owner'){
        cmdOwner += `\`${process.env.DISCORD_BOT_PREFIX}${command}\` - ${cmdKey.description}\n`
      }
      else if(cmdKey.category === 'neko'){
        cmdNeko += `\`${process.env.DISCORD_BOT_PREFIX}${command}\` - ${cmdKey.description}\n`
      }
    })

    //send help commands
    loading.edit(client.resource.embed()
      .setTitle(`Aya Commands\n`)
      .setDescription(
        `**General Commands**\n ${cmdGeneral}\n`+
        `**Owner Commands**\n ${cmdOwner}\n`+
        `**Neko Commands**\n ${cmdNeko}\n`
      )
    );
  }
}