const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class PingCommand extends BaseCommand {
  constructor() {
    super('ping', 'test', []);
  }

  async run(client, message, args) {
    //send loading embed
    let loading = await message.channel.send(client.resource.loading())
    loading.edit(client.resource.embed()
      .setDescription(`🏓 Pong! ${client.ws.ping}ms`)
    );
  }
}