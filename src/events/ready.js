const BaseEvent = require('../utils/structures/BaseEvent');

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super('ready');
  }
  async run (client) {
    client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | ${process.env.DISCORD_BOT_PREFIX}help` }})
    console.log(`[INFO] - Presence set: LISTENING to ${client.guilds.cache.size} servers. | ${process.env.DISCORD_BOT_PREFIX}help`)
    console.log(client.user.tag + ' has logged in.');
    client.resource.sendLive(client, process.env.LIVE_CHANNEL,
      `[INFO]`,
      `Presence set: LISTENING to ${client.guilds.cache.size} servers. | ${process.env.DISCORD_BOT_PREFIX}help`+
      `${client.user.tag} has logged in.`
      )
  }
}
