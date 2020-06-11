const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class RestartCommand extends BaseCommand {
  constructor() {
    super('restart', 'owner', [], 'Restart the entire bot with this command.');
  }

  async run(client, message, args) {
    await client.destroy();
    process.exit(1);
  }
}