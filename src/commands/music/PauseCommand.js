const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class PauseCommand extends BaseCommand {
  constructor() {
    super('pause', 'music', ['resume'], 'Pause/Resume the music.');
  }

  run(client, message, args) {
    const { voiceChannel } = message.member;
    const player = client.music.players.get(message.guild.id);
    
    if (voiceChannel && voiceChannel.id !== player.voiceChannel.id) {
      return message.channel.send(`You need to be in the same voice channel as the the bot to use this command.`);
    }
    if (!player) {
      return message.channel.send(`No song's currently playing.`);
    }

    player.pause(player.playing);
    return message.channel.send(`Music paused/resumed`);
  }
}