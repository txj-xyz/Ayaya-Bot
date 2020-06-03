const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

module.exports = class SkipCommand extends BaseCommand {
  constructor() {
    super('skip', 'music', ['next'], 'Skip a song with this.');
  }

  run(client, message, args) {
    let loading = await message.channel.send(client.resource.loading())

    const player = client.music.players.get(message.guild.id);
    if (!player) {
      return loading.edit(client.resource.embed().setDescription(`No song's currently playing.`));
    }

    const voiceChannel  = message.member.voice.channel;
    if (!voiceChannel || voiceChannel.id !== player.voiceChannel.id) {
      return loading.edit(client.resource.embed().setDescription(`You need to be in the same voice channel as the bot to use this command.`));
    }

    const skipEmbed = new MessageEmbed()
      .setAuthor(`Skipping`, `https://i.imgur.com/5tJBRa8.gif`)
      .setTitle(`${player.queue[0].title}`)
      .setURL(`${player.queue[0].uri}`)

      .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
      .setTimestamp()

    loading.edit(skipEmbed)
    player.stop();
    return;
  }
}