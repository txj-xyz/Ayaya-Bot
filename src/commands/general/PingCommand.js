const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class PingCommand extends BaseCommand {
  constructor() {
    super('ping', 'general', [], 'Ping the websocket with this command.');
  }

  async run(client, message, args) {
    //send loading embed
    let loading = await message.channel.send(client.resource.loading())
    loading.edit(client.resource.embed()
      .setDescription(`🏓 Pong! ${client.ws.ping}ms`)
    );
  }
}