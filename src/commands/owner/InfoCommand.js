const BaseCommand = require('../../utils/structures/BaseCommand');
const humanizeDuration = require('humanize-duration')

module.exports = class InfoCommand extends BaseCommand {
  constructor() {
    super('info', 'owner', [], 'Prints debug information to the channel.');
  }

  async run(client, message, args) {

    let loading = await message.channel.send(client.resource.loading())
    loading.edit(client.resource.embed()
        .setTitle('Aya Stats')
        .setColor('#03a9fc')
        .setTimestamp()
        .setDescription(
          `\`\`\`\nUptime: ${humanizeDuration(client.uptime)}\n`+
          `Users: ${client.users.cache.size}\n`+
          `Guilds: ${client.guilds.cache.size}\n`+
          `Language: NodeJS\n`+
          `Memory Usage: ${process.memoryUsage().rss / 1000000}MB\n`+
          `WS Latency: ${client.ws.ping}ms\n`+
          `Owner: TXJ#5664\n`+
          `Total Commands: ${client.commands.size}\n`+
          `Total Aliases: ${client.commands.alias.size}\`\`\``
        )
    )
  }
}