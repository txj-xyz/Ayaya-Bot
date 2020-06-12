const BaseCommand = require('../../utils/structures/BaseCommand');
const { reloadCommands } = require('../../utils/registry');

module.exports = class ReloadCommand extends BaseCommand {
  constructor() {
    super('reload', 'owner', [], 'Reload commands with this!');
  }

  async run(client, message) {
    client.loadfail = [];
    let loading = await message.channel.send(client.resource.loading());
    reloadCommands(client);
    loading.edit(client.resource.embed()
      .setTitle(`<:check:694636220571189389> Success!`)
      .addField(`Alias Commands`, `\`${client.alias.size}\` reloaded.`, false)
      .addField(`Base Commands`, `\`${client.commands.size}\` reloaded.`, false)
      .addField(`Failed Commands`, `\`${client.loadfail.length}\` failed to load due to an error`, false)
      .setDescription(`\`\`\`js\n${client.loadfail.join("\n")}\n\`\`\``));
    }
}