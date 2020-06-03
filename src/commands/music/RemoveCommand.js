const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

module.exports = class RemoveCommand extends BaseCommand {
  constructor() {
    super('remove', 'music', ['delete'], 'Remove a song from the queue.');
  }

  async run(client, message, args) {
    const check = client.emojis.cache.get("697805081709510748");
    const cross = client.emojis.cache.get("697805129109209190");
    
    const player = client.music.players.get(message.guild.id);
    if (!player || !player.queue[0]) {
      return message.channel.send(`No song's currently playing.`);
    }

    const voiceChannel  = message.member.voice.channel;
    if (!voiceChannel || voiceChannel.id !== player.voiceChannel.id) {
      return message.channel.send(`You need to be in the same voice channel as the bot to use this command.`);
    }

    if (args[0]) {
      let choice = Number(args[0] - 1);

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
          player.queue.remove(choice);

          const checkEmbed = new MessageEmbed()
            .setAuthor(`Successfully Removed Song`, `https://i.imgur.com/rmha2H7.gif`)
            .setTitle(`${player.queue[choice].title}`)
            .setURL(`${player.queue[choice].uri}`)

            .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
            .setTimestamp()

          message.channel.send(checkEmbed);
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