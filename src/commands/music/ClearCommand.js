const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

module.exports = class ClearCommand extends BaseCommand {
  constructor() {
    super('clear', 'music', [], 'Clear the queue of songs.');
  }

  async run(client, message, args) {
    let loading = await message.channel.send(client.resource.loading())

    const player = client.music.players.get(message.guild.id);
    if (!player || !player.queue[0]) {
      
      return loading.edit(client.resource.embed().setDescription(`No song's currently playing.`))
    }

    const voiceChannel  = message.member.voice.channel;
    if (!voiceChannel || voiceChannel.id !== player.voiceChannel.id) {
      return loading.edit(client.resource.embed().setDescription(`You need to be in the same voice channel as the bot to use this command.`));
    }
    await player.queue.clear();
    loading.edit(client.resource.embed().setDescription(``))
  }
}