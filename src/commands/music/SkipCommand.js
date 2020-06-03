const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

module.exports = class SkipCommand extends BaseCommand {
  constructor() {
    super('skip', 'music', ['next'], 'Skip a song with this.');
  }

  run(client, message, args) {
    const player = client.music.players.get(message.guild.id);
    if (!player) {
      return message.channel.send(`No song's currently playing.`);
    }

    const voiceChannel  = message.member.voice.channel;
    if (!voiceChannel || voiceChannel.id !== player.voiceChannel.id) {
      return message.channel.send(`You need to be in the same voice channel as the bot to use this command.`);
    }

    const skipEmbed = new MessageEmbed()
      .setAuthor(`Skipping`, `https://i.imgur.com/5tJBRa8.gif`)
      .setTitle(`${player.queue[0].title}`)
      .setURL(`${player.queue[0].uri}`)

      .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
      .setTimestamp()

    message.channel.send(skipEmbed)
    player.stop();
    return;
  }
}