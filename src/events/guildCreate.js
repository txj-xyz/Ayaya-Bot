const BaseEvent = require('../utils/structures/BaseEvent');

module.exports = class GuildCreateEvent extends BaseEvent {
  constructor() {
    super('guildCreate');
  }
  async run (client, guild) {
    console.log(`[INFO] - JOINED GUILD ${guild.id}`)
    client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | ${process.env.DISCORD_BOT_PREFIX}help` }})
    client.channels.cache.get("724698472699133953").send(client.resource.join(guild));
  }
}
