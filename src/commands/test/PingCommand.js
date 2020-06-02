const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class PingCommand extends BaseCommand {
  constructor() {
    super('ping', 'test', []);
  }

  async run(client, message, args) {
    message.channel.send(`Pong! ${client.ws.ping}ms`)
  }
}