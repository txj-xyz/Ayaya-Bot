const BaseCommand = require('../../utils/structures/BaseCommand');
const { Utils } = require(`erela.js`);
const { MessageEmbed } = require(`discord.js`);

module.exports = class PlayCommand extends BaseCommand {
  constructor() {
    super('play', 'music', ['p', 'pplay'], 'Play music on the bot.');
  }
  async run(client, message, args) {
    let loading = await message.channel.send(client.resource.loading())

    const voiceChannel  = message.member.voice.channel;
    if (!voiceChannel) {
      return loading.edit(client.resource.embed()
      .setAuthor("Failed", "https://cdn.discordapp.com/emojis/694636239810330724.png", "https://discord.gg/CSJkCGx")
      .setDescription(`Please join a voice channel before using this command.`));
    }

    const permissions = voiceChannel.permissionsFor(client.user);
    if (!permissions.has(`CONNECT`) || !permissions.has(`SPEAK`)) {
      return loading.edit(client.resource.embed()
      .setAuthor("Failed", "https://cdn.discordapp.com/emojis/694636239810330724.png", "https://discord.gg/CSJkCGx")
      .setDescription(``));
    }

    if (!args[0]) {
      return loading.edit(client.resource.embed()
      .setAuthor("Failed", "https://cdn.discordapp.com/emojis/694636239810330724.png", "https://discord.gg/CSJkCGx")
      .setDescription(`Please provide a song name or link!`));
    }

    const player = client.music.players.spawn({
      guild: message.guild,
      textChannel: message.channel,
      voiceChannel
    });

    client.music.search(args.join(` `), message.author).then( async result => {
      switch (result.loadType) {
        case `TRACK_LOADED`:
          player.queue.add(result.tracks[0]);
          console.log(`[INFO][MUSIC] - TRACK_LOADED - ${result.tracks[0].title}`)
            loading.edit(client.resource.embed()
            .setAuthor("Queueing", "https://i.imgur.com/NKrXtzA.gif", `${result.tracks[0].uri}`)
            .setDescription(`\`${result.tracks[0].title}\``));
          if (!player.playing) {
            player.play();
          }
          break;

        case `SEARCH_RESULT`:
          console.log(`[INFO][MUSIC] - SEARCH_RESULT - ${result.tracks[0].title}`)
          const track = result.tracks[0];
          player.queue.add(track)
            loading.edit(client.resource.embed()
            .setAuthor(`Queueing`, "https://i.imgur.com/NKrXtzA.gif", `${result.tracks[0].uri}`)
            .setDescription(`\`${result.tracks[0].title}\``));
          if(!player.playing) player.play();
          break;
        
        case `PLAYLIST_LOADED`:
          console.log("PLAYLIST_LOADED")
          result.playlist.tracks.forEach(track => player.queue.add(track));
          const duration = Utils.formatTime(result.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, true);
            loading.edit(client.resource.embed()
            .setAuthor("Queueing", "https://i.imgur.com/NKrXtzA.gif", `${result.tracks[0].uri}`)
            .setDescription(`\`${result.tracks[0].title}\``));
          message.channel.send(`Enqueuing \`${result.playlist.tracks.length}\` \`${duration}\` tracks in playlist \`${result.playlist.info.name}\``);
          if(!player.playing) player.play()
          break;

        case `NO_MATCHES` :
          loading.edit(client.resource.embed()
            .setAuthor("Failed", "https://cdn.discordapp.com/emojis/694636239810330724.png", "https://discord.gg/CSJkCGx")
            .setDescription(`There was an error while trying to play the song. Please run the command again!`));
          break;

        case `LOAD_FAILED` :
          loading.edit(client.resource.embed()
            .setAuthor("Failed", "https://cdn.discordapp.com/emojis/694636239810330724.png", "https://discord.gg/CSJkCGx")
            .setDescription(`There was an error while trying to play the song. Please run the command again!`));
          break;
      }
    });
  }
}