const BaseCommand = require('../../utils/structures/BaseCommand');
const { reloadCommands } = require('../../utils/registry');

module.exports = class ReloadCommand extends BaseCommand {
  constructor() {
    super('reload', 'owner', [], 'Reload commands with this!');
  }

  async run(client, message, args) {

    let loading = await message.channel.send(client.resource.loading());
    await reloadCommands(client)
    
    loading.edit(client.resource.embed()
      .setTitle(`<:check:694636220571189389> Success!`)
      .addField(`Alias Commands`, `\`${client.alias.size}\` reloaded.`, false)
      .addField(`Base Commands`, `\`${client.commands.size}\` reloaded.`, false)
    );
  }
}