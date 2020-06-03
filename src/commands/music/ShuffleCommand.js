const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

module.exports = class ShuffleCommand extends BaseCommand {
  constructor() {
    super('shuffle', 'music', ['mix'], 'Shuffle the music queue.');
  }

  run(client, message, args) {
    const player = client.music.players.get(message.guild.id);
    if (!player || !player.queue[0]) {
      return message.channel.send(`No song's currently playing.`);
    }

    const voiceChannel  = message.member.voice.channel;
    if (!voiceChannel || voiceChannel.id !== player.voiceChannel.id) {
      return message.channel.send(`You need to be in the same voice channel as the bot to use this command.`);
    }

    player.queue.shuffle();

    if (player.queue.size > 10) {
      let list = ``,
        count = 0   ;
      for (let i = 0; i < 10; i++) {
        list += `**${++count}) [${player.queue[i].title}](${player.queue[i].uri})**\n`;
      }

      const newQueueEmbed = new MessageEmbed()
        .setAuthor(`Suffled Queue`, `https://i.imgur.com/1P4imzB.gif`)
        .setDescription(`${list}${player.queue.size - 10} more...`)

        .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
        .setTimestamp()

      message.channel.send(newQueueEmbed)
    }
    else {
      let list = ``,
        count = 0   ;
      for (let i = 0; i < player.queue.size; i++) {
        list += `**${++count}) [${player.queue[i].title}](${player.queue[i].uri})**\n`;
      }

      const newQueueEmbed = new MessageEmbed()
        .setAuthor(`Suffled Queue`, `https://i.imgur.com/1P4imzB.gif`)
        .setDescription(`${list}`)

        .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
        .setTimestamp()

      message.channel.send(newQueueEmbed)
    }
  }
}