const BaseCommand = require('../../utils/structures/BaseCommand');
const { reloadCommands } = require('../../utils/registry');

module.exports = class PingCommand extends BaseCommand {
  constructor() {
    super('reload', 'Reload all commands', []);
  }

  async run(client, message, args) {
    await reloadCommands(client, '../commands')
    message.channel.send(`Reloaded all commands`)
  }
}