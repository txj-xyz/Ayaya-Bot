const BaseEvent = require('../../utils/structures/BaseEvent');

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
      
      //stop commands for entire category
      //if(client.commands.get(cmdName).category === 'owner' && message.author.id !== process.env.DISCORD_BOT_OWNER) return console.log(`[WARN] - Owner command used without authority - [${message.author.tag}]`)
      if (command) {
        console.log(`[INFO] - Command executed [${command.name}] in channel [${message.channel.name}]`)
        command.run(client, message, cmdArgs);
      }
    }
  }
}