const BaseCommand = require('../../utils/structures/BaseCommand');

const { Utils } = require('erela.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('youtube-info');

module.exports = class NowPlayingCommand extends BaseCommand {
  constructor() {
    super('nowPlaying', 'music', ['np', 'playing'], 'Check what is currently playing.');
  }

  async   run(client, message, args) {
    const player = client.music.players.get(message.guild.id);
    if (!player || !player.queue[0]) {
      return message.channel.send(`No song's currently playing.`)
    }

    let track = player.queue[0],
      trackInfo = await fetch(track.identifier);

    const currentTrack = new MessageEmbed()
      .setAuthor(`Now Playing`, `https://i.imgur.com/NKrXtzA.gif`)
      .setTitle(`${trackInfo.title}`)
      .setURL(trackInfo.url)
      .setImage(trackInfo.thumbnailUrl)

      .addField(`Owner`, trackInfo.owner, true)
      .addField(`Date Published`, trackInfo.datePublished, true)
      .addField(`Genre`, trackInfo.genre, true)
      .addField(`Duration`, Utils.formatTime(track.duration, true), true)
      .addField(`Views`, trackInfo.views, true)
      .addField(`Likes | Dislikes`, `${trackInfo.likeCount} **|** ${trackInfo.dislikeCount}`, true)

      .setFooter(`Requested by - ${track.requester.username}`, track.requester.avatarURL())
      .setTimestamp()

    message.channel.send(currentTrack);
  }
}