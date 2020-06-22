const BaseEvent = require('../utils/structures/BaseEvent');

module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor() {
    super('guildDelete');
  }
  async run (client, guild) {
    console.log(`[INFO] - LEFT GUILD ${guild.id}`)
    client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | ${process.env.DISCORD_BOT_PREFIX}help` }})
    client.channels.cache.get("724698472699133953").send(client.resource.leave(guild));
  }
}
