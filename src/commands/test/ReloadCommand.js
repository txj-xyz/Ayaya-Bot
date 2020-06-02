const BaseCommand = require('../../utils/structures/BaseCommand');
const { reloadCommands } = require('../../utils/registry');

module.exports = class PingCommand extends BaseCommand {
  constructor() {
    super('reload', 'Reload all commands', []);
  }

  async run(client, message, args) {
    if(message.author.id !== process.env.DISCORD_BOT_OWNER) return;

    let loading = await message.channel.send(client.resource.loading());
    await reloadCommands(client)
    loading.edit(client.resource.embed()
      .setTitle(`Success! <:check:694636220571189389>`)
      .setDescription(`Reloaded all commands.`)
    );
  }
}