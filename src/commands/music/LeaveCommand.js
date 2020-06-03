const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class LeaveCommand extends BaseCommand {
  constructor() {
    super('leave', 'music', ['lev', 'stop'], 'Leaves the channel the bot is playing music in.');
  }

  async run(client, message, args) {
    const { voiceChannel } = message.member;
    const player = client.music.players.get(message.guild.id);
    
    if (voiceChannel && voiceChannel.id !== player.voiceChannel.id) {
      return message.channel.send(`You need to be in the same voice channel as the the bot to use this command.`);
    }
    if (!player) {
      return message.channel.send(`No song's currently playing.`);
    }

    client.music.players.destroy(message.guild.id);
    return message.channel.send(`Music has been stopped!`);
  }
}