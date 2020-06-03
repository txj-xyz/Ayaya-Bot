const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

module.exports = class ShuffleCommand extends BaseCommand {
  constructor() {
    super('shuffle', 'music', ['mix'], 'Shuffle the music queue.');
  }

  run(client, message, args) {
    let loading = await message.channel.send(client.resource.loading())

    const player = client.music.players.get(message.guild.id);
    if (!player || !player.queue[0]) {
      return loading.edit(client.resource.embed().setDescription(`No song's currently playing.`));
    }

    const voiceChannel  = message.member.voice.channel;
    if (!voiceChannel || voiceChannel.id !== player.voiceChannel.id) {
      return loading.edit(client.resource.embed().setDescription(`You need to be in the same voice channel as the bot to use this command.`));
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

      loading.edit(newQueueEmbed)
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

      loading.edit(newQueueEmbed)
    }
  }
}