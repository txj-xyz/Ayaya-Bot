const BaseCommand = require('../../utils/structures/BaseCommand');
let commandsListing = '';

module.exports = class HelpCommand extends BaseCommand {
  constructor() {
    super('help', 'general', [], 'Shows this help page!');
  }

  async run(client, message, args) {
    let loading = await message.channel.send(client.resource.loading())
    await client.commands.forEach(function(cmdKey, command) {
      if(cmdKey.category === 'general'){
        commandsListing += `\`${process.env.DISCORD_BOT_PREFIX}${command}\` - ${cmdKey.description}\n`
      }
      // else {
      //   console.log(`Key is not 'General' ${command} - ${cmdKey.description}`)
      // }
    })
    loading.edit(client.resource.embed()
      .setTitle(`Aya Commands\n`)
      .setDescription(commandsListing)
    );
  }
}