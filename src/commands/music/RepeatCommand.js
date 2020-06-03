const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

module.exports = class RepeatCommand extends BaseCommand {
  constructor() {
    super('repeat', 'music', ['again'], 'Repeats the same track, not the same as loop.');
  }

  async run(client, message, args) {
    let loading = await message.channel.send(client.resource.loading())

    const check = client.emojis.cache.get("697805081709510748");
    const cross = client.emojis.cache.get("697805129109209190");

    const player = client.music.players.get(message.guild.id);
    if (!player || !player.queue[0]) {
      return loading.edit(client.resource.embed().setDescription(`No song's currently playing.`))
    }

    if (player.trackRepeat) {
      const currentTrack = new MessageEmbed()
        .setAuthor(`Turn Off Repeating?`, `https://i.imgur.com/rmha2H7.gif`)
        .setTitle(`${player.queue[0].title}`)
        .setURL(`${player.queue[0].uri}`)

        .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
        .setTimestamp()

      const sentMsg = await loading.edit(currentTrack);
  
      await sentMsg.react(check);
      await sentMsg.react(cross);
  
      const filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id);
      const collector = sentMsg.createReactionCollector(filter);
  
      collector.on('collect', (reaction, user) => {
        if (reaction.emoji.name === check.name) {
          player.setTrackRepeat(false);
        }
        else if (reaction.emoji.name === cross.name) {
          collector.stop();
        }
      });
    }
    else {
      const currentTrack = new MessageEmbed()
        .setAuthor(`Turn On Repeating?`, `https://i.imgur.com/rmha2H7.gif`)
        .setTitle(`${player.queue[0].title}`)
        .setURL(`${player.queue[0].uri}`)

        .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
        .setTimestamp()
        
      const sentMsg = await loading.edit(currentTrack);

      await sentMsg.react(check);
      await sentMsg.react(cross);

      const filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id);
      const collector = sentMsg.createReactionCollector(filter);

      collector.on('collect', (reaction, user) => {
        if (reaction.emoji.name === check.name) {
          player.setTrackRepeat(true);
        }
        else if (reaction.emoji.name === cross.name) {
          collector.stop();
        }
      });
    }
  }
}