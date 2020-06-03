const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class InviteCommand extends BaseCommand {
  constructor() {
    super('invite', 'general', [], 'Invite the bot to your server!');
  }

  async run(client, message, args) {
    let loading = await message.channel.send(client.resource.loading())
    loading.edit(client.resource.embed()
      .setDescription(`https://discord.com/oauth2/authorize?client_id=717080513898217482&permissions=37013568&scope=bot`)
    );
  }
}