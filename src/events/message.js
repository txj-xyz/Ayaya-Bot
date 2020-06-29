const BaseEvent = require('../utils/structures/BaseEvent');

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super('message');
  }
  
  async run(client, message) {
    if (message.author.bot) return;
    if (message.content.startsWith(client.prefix)) {
      const [cmdName, ...cmdArgs] = message.content
      .slice(client.prefix.length)
      .trim()
      .split(/\s+/);
      const command = client.commands.get(cmdName);
      const aliascommand = client.alias.get(cmdName);
      
      if (command) {
        if(client.commands.get(cmdName).category === 'owner' && message.author.id !== process.env.DISCORD_BOT_OWNER) return console.log(`[WARN] - Owner command used without authority - [${message.author.tag}]`)
        console.log(`[INFO] - Command executed [${command.name}] in channel [${message.channel.name}]`)
        client.resource.sendLive(
          client, process.env.LIVE_CHANNEL,
          `[INFO] - Command executed`,
          `Command: ${command.name}\n`+
          `Args: ${cmdArgs.join(` `)}\n`+
          `User: ${message.author.tag}\n`+
          `User ID: ${message.author.id}`
        )
        command.run(client, message, cmdArgs);
      }
      //setup alias handler for the seperate map here
      if (aliascommand) {
        if(client.alias.get(cmdName).category === 'owner' && message.author.id !== process.env.DISCORD_BOT_OWNER) return console.log(`[WARN] - Owner command used without authority - [${message.author.tag}]`)
        console.log(`[INFO] - Command executed [${aliascommand.name}] in channel [${message.channel.name}]`)
        client.resource.sendLive(
          client, process.env.LIVE_CHANNEL,
          `[INFO] - Command executed`,
          `Command: ${aliascommand.name}\n`+
          `Args: ${cmdArgs.join(` `)}\n`+
          `User: ${message.author.tag}\n`+
          `User ID: ${message.author.id}`
        )
        aliascommand.run(client, message, cmdArgs); //run the alias command
      }
    }
  }
}