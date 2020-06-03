const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

module.exports = class QueueCommand extends BaseCommand {
  constructor() {
    super('queue', 'music', ['q'], 'Show the first 10 songs in the queue');
  }

  async run(client, message, args) {
    let forward = client.emojis.cache.get('711633615125217330'),
      backward = client.emojis.cache.get('711633615083274280');

    const player = client.music.players.get(message.guild.id);
    if (!player || !player.queue[0]) {
      return message.channel.send(`No song's currently playing.`);
    }

    if (player.queue.size > 10) {
      let currentPage = 0,
        embeds = await generateEmbeds(player.queue, message);

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
            
            await reaction.users.remove(user.id);
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
    else {
      let list = ``,
      count = 0   ;
      for (let i = 0; i < player.queue.size; i++) {
        list += `**${++count}) [${player.queue[i].title}](${player.queue[i].uri})**\n`;
      }

      const queueEmbed = new MessageEmbed()
        .setAuthor(`Queue`)
        .setTitle(`Current Song: ${player.queue[0].title}`)
        .setURL(player.queue[0].uri)
        .setDescription(`${list}`)

        .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
        .setTimestamp()

      message.channel.send(queueEmbed)
    }
  }
}

function generateEmbeds(queue, message) {
  let embeds = [],
    k = 10;

  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;
    
    const info = current.map(track => `**${++j}) [${track.title}](${track.uri})**`).join(`\n`);

    const embed = new MessageEmbed()
      .setAuthor(`Queue`)
      .setTitle(`Current Song: ${queue[0].title}`)
      .setURL(queue[0].uri)
      .setDescription(`${info}`)

      .setFooter(`Page ${i+1} of ${Math.ceil(queue.size / 10)}\nRequested by - ${message.author.username}`,message.author.avatarURL())
      .setTimestamp()

    embeds.push(embed);
  }
  return embeds;
}