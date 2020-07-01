const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

module.exports = class RemoveCommand extends BaseCommand {
  constructor() {
    super('remove', 'music', [''], 'Remove a song from the queue.');
  }

  async run(client, message, args) {
    let loading = await message.channel.send(client.resource.loading())

    const check = client.emojis.cache.get("697805081709510748");
    const cross = client.emojis.cache.get("697805129109209190");
    
    const player = client.music.players.get(message.guild.id);
    if (!player || !player.queue[0]) {
      return loading.edit(client.resource.embed().setDescription(`No song's currently playing.`));
    }

    const voiceChannel  = message.member.voice.channel;
    if (!voiceChannel || voiceChannel.id !== player.voiceChannel.id) {
      return loading.edit(client.resource.embed().setDescription(`You need to be in the same voice channel as the bot to use this command.`));
    }

    if (args[0]) {
      let choice = Number(args[0] - 1);

      const checkEmbed = new MessageEmbed()
        .setAuthor(`Remove Song?`, `https://i.imgur.com/rmha2H7.gif`)
        .setTitle(`${player.queue[choice].title}`)
        .setURL(`${player.queue[choice].uri}`)

        .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
        .setTimestamp()

      const sentMsg = await loading.edit(checkEmbed);

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

          loading.edit(checkEmbed);
        }
        else if (reaction.emoji.name === cross.name) {
          collector.stop();
        }
      });
    }
    else {
      return loading.edit(client.resource.embed().setDescription(`Please provide a song number to remove.`));
    }
  }
}