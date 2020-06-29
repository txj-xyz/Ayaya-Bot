const BaseCommand = require('../../utils/structures/BaseCommand');
const { Utils } = require(`erela.js`);
const { MessageEmbed } = require(`discord.js`);

module.exports = class AyayaCommand extends BaseCommand {
  constructor() {
    super('ayaya', 'general', [], 'Do the thing with that thing, you know the ayayayayayayaya thing??');
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
      .setDescription(`I do not have permissions to speak in the channel you are in, please give me permissions to join.`));
    }

    const player = client.music.players.spawn({
      guild: message.guild,
      textChannel: message.channel,
      voiceChannel
    });

    client.music.search(`https://youtu.be/D0q0QeQbw9U`, message.author).then( async (result) => {
      switch (result.loadType) {
        case `TRACK_LOADED`:
          player.queue.add(result.tracks[0]);
          console.log(`[INFO][MUSIC] - TRACK_LOADED - ${result.tracks[0].title}`)
            loading.edit(client.resource.embed().setDescription(`AYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAY \n\nhint: to stop type \`${process.env.DISCORD_BOT_PREFIX}stop\``));
          if (!player.playing) player.play();
          break;
      }
    })
  }
}