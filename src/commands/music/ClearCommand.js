const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

module.exports = class ClearCommand extends BaseCommand {
  constructor() {
    super('clear', 'music', [], 'Clear the queue of songs.');
  }

  async run(client, message, args) {
    const player = client.music.players.get(message.guild.id);
    if (!player || !player.queue[0]) {
      return message.channel.send(`No song's currently playing.`);
    }

    const voiceChannel  = message.member.voice.channel;
    if (!voiceChannel || voiceChannel.id !== player.voiceChannel.id) {
      return message.channel.send(`You need to be in the same voice channel as the bot to use this command.`);
    }

    if (args[0]) {
      let choice = Number(args[0]);

      const checkEmbed = new MessageEmbed()
        .setAuthor(`Remove Song?`, `https://i.imgur.com/rmha2H7.gif`)
        .setTitle(`${player.queue[choice].title}`)
        .setURL(`${player.queue[choice].uri}`)

        .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
        .setTimestamp()

      const sentMsg = await message.channel.send(checkEmbed);

      await sentMsg.react(check);
      await sentMsg.react(cross);

      const filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id);
      const collector = sentMsg.createReactionCollector(filter);

      collector.on('collect', (reaction, user) => {
        if (reaction.emoji.name === check.name) {
          player.queue.clear();
        }
        else if (reaction.emoji.name === cross.name) {
          collector.stop();
        }
      });
    }
    else {
      return message.channel.send(`Please provide a song number to remove.`);
    }
  }
}