const BaseCommand = require('../../utils/structures/BaseCommand');
const { Utils } = require('erela.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('youtube-info');

module.exports = class FullQueueCommand extends BaseCommand {
  constructor() {
    super('fullQueue', 'music', ['fq'], 'List the entire queue in one command.');
  }

  async run(client, message, args) {
    let forward = client.emojis.cache.get('711633615125217330'),
      backward = client.emojis.cache.get('711633615083274280');

    const player = client.music.players.get(message.guild.id);
    if (!player || !player.queue[0]) {
      return message.channel.send(`No song's currently playing.`);
    }

    let currentPage = 0,
      embeds = await generateEmbeds(player.queue);

    const queueEmbed = await message.channel.send(embeds[currentPage]);
    await queueEmbed.react(backward);
    await queueEmbed.react(forward);

    const filter = (reaction, user) => [forward.name, backward.name].includes(reaction.emoji.name) && (message.author.id === user.id);
    const collector = queueEmbed.createReactionCollector(filter);

    collector.on('collect', async (reaction, user) => {
      if (reaction.emoji.name === forward.name) {
        if (currentPage < embeds.length - 1) {
          currentPage++;
          queueEmbed.edit(embeds[currentPage]);
          
          await reaction.users.remove(user.id)
        }
        else {
          await reaction.users.remove(user.id);
        }
      }
      else if (reaction.emoji.name === backward.name) {
        if (currentPage !== 0) {
          currentPage--;
          queueEmbed.edit(embeds[currentPage]);
          
          await reaction.users.remove(user.id)
        }
        else {
          await reaction.users.remove(user.id);
        }
      }
    });
  }
}

async function generateEmbeds(queue) {
  let embeds = [];

  for (let i = 0; i < queue.length; i ++) {    
    let track = queue[i],
      trackInfo = await fetch(track.identifier);

    const embed = new MessageEmbed()
      .setAuthor(`Full Queue`, `https://i.imgur.com/NKrXtzA.gif`)
      .setTitle(`${trackInfo.title}`)
      .setURL(trackInfo.url)
      .setImage(trackInfo.thumbnailUrl)

      .addField(`Owner`, trackInfo.owner, true)
      .addField(`Date Published`, trackInfo.datePublished, true)
      .addField(`Genre`, trackInfo.genre, true)
      .addField(`Duration`, Utils.formatTime(track.duration, true), true)
      .addField(`Views`, trackInfo.views, true)
      .addField(`Likes | Dislikes`, `${trackInfo.likeCount} **|** ${trackInfo.dislikeCount}`, true)

      .setFooter(`Song ${i+1} of ${queue.size}\nRequested by - ${track.requester.username}`, track.requester.avatarURL())
      .setTimestamp()

    embeds.push(embed);
  }
  return embeds;
}