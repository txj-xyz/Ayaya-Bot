const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');
const functions = require('../../utils/functions');

module.exports = class VolumeCommand extends BaseCommand {
  constructor() {
    super('volume', 'music', ['vol', 'v'], 'Change the music volume.');
  }

  async run(client, message, args) {
    let full = client.emojis.cache.get('695665110093398028'),
      empty = client.emojis.cache.get('695665145266962443'),
      muted = client.emojis.cache.get('711386849754611732'),
      volume = client.emojis.cache.get('711634431714000906'),
      check = client.emojis.cache.get('697805081709510748'),
      cross = client.emojis.cache.get('697805129109209190');

    const player = client.music.players.get(message.guild.id);
    if (!player) {
      let embed = new MessageEmbed()
        //.setTitle(`🚫 Error`)
        .addField(`Invalid Command`, `\`\`\`\nCommand may only be used when music is playing!\n\`\`\``, false)
        .addField(`Requested By`, `\`\`\`\n${message.author.tag}\n\`\`\``, false)

        .setFooter(`Provided by - *T H E*  B O T`,client.user.avatarURL())
        .setTimestamp()

      return message.channel.send(embed);
    }

    const voiceChannel = message.member.voice.channel;
    if (voiceChannel && voiceChannel.id !== player.voiceChannel.id) {
      let embed = new MessageEmbed()
        //.setTitle(`🚫 Error`)
        .addField(`Invalid Command`, `\`\`\`\nCommand may only be used while you are in the same voice channel as the bot!\n\`\`\``, false)
        .addField(`Requested By`, `\`\`\`\n${message.author.tag}\n\`\`\``, false)

        .setFooter(`Provided by - *T H E*  B O T`,client.user.avatarURL())
        .setTimestamp()

      return message.channel.send(embed);
    }

    const textChannel = message.channel;
    if (textChannel && textChannel.id !== player.textChannel.id) {
      let embed = new MessageEmbed()
        //.setTitle(`🚫 Error`)
        .addField(`Invalid Command`, `\`\`\`\nCommand may only be used while you are in the same text channel as the music!\n\`\`\``, false)
        .addField(`Requested By`, `\`\`\`\n${message.author.tag}\n\`\`\``, false)

        .setFooter(`Provided by - *T H E*  B O T`,client.user.avatarURL())
        .setTimestamp()

      return message.channel.send(embed);
    }

    if (args[0]) {
      if (!parseInt(args[0]) || isNaN(parseInt(args[0]))) {
        let embed = new MessageEmbed()
          //.setTitle(`🚫 Error`)
          .addField(`Invalid Argument`, `\`\`\`\nArgument may only be a number between 1 - 100!\n\`\`\``, false)
          .addField(`Requested By`, `\`\`\`\n${message.author.tag}\n\`\`\``, false)

          .setFooter(`Provided by - *T H E*  B O T`,client.user.avatarURL())
          .setTimestamp()

        return message.channel.send(embed);
      }
      if ((args[0] <= 0 || args[0] > 100)) {
        let embed = new MessageEmbed()
          //.setTitle(`🚫 Error`)
          .addField(`Invalid Command`, `\`\`\`\nCommand may only be used when music is playing!\n\`\`\``, false)
          .addField(`Requested By`, `\`\`\`\n${message.author.tag}\n\`\`\``, false)

          .setFooter(`Provided by - *T H E*  B O T`,client.user.avatarURL())
          .setTimestamp()

        return message.channel.send(embed);
      }

      if (await functions.checkUser(message.guild, message.author)) {
        player.setVolume(args[0])
        let bar = generateBar(args
          [0], full, empty);

        let volumeEmbed = new MessageEmbed()
          //.setTitle(`🚫 Error`)
          .addField(`Volume Set`, `\n${muted.toString()} ${bar} ${volume.toString()}\n`, false)
          .addField(`Requested By`, `\`\`\`\n${message.author.tag}\n\`\`\``, false)

          .setFooter(`Provided by - *T H E*  B O T`,client.user.avatarURL())
          .setTimestamp()
        // const volumeEmbed = new MessageEmbed()
        //   .setAuthor(`Volume Set: ${args[0]}`, `https://i.imgur.com/9r0jjcQ.png`)
        //   .setDescription(`${muted.toString()} ${bar} ${volume.toString()}`)

        //   .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
        //   .setColor(config.embedColor)
        //   .setTimestamp()
          
        return message.channel.send(volumeEmbed); 
      }
      else {
        const members = voiceChannel.members.filter(m => !m.user.bot);

        if (members.size === 1) {
          player.setVolume(args[0])
          let bar = generateBar(args[0], full, empty);

          const volumeEmbed = new MessageEmbed()
            .setAuthor(`Volume Set: ${args[0]}`, `https://i.imgur.com/9r0jjcQ.png`)
            .setDescription(`${muted.toString()} ${bar} ${volume.toString()}`)

            .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
            .setTimestamp()
            
          return message.channel.send(volumeEmbed);
        }
        else {
          const votesRequired = Math.ceil(members.size * 0.5);
          let yesVotes = 0,
            noVotes = 0;

          let bar = generateBar(args[0], full, empty);

          const volumeEmbed = new MessageEmbed()
            .setAuthor(`Vote Required!`, `https://i.imgur.com/9r0jjcQ.png`)
            .setTitle(`Minimum votes required to change volume: ${votesRequired}`)
            .setDescription(`${muted.toString()} ${bar} ${volume.toString()}`)

            .setFooter(`Vote ends in 30 seconds.\nRequested by - ${message.author.username}`,message.author.avatarURL())
            .setTimestamp()
            
          const sentEmbed = await message.channel.send(volumeEmbed);
          await sentEmbed.react(check);
          await sentEmbed.react(cross);

          const filter = (reaction, user) => {
            if (user.bot) return false;

            const voiceChannel =  message.guild.members.cache.get(user.id).voice.channel;
            if (voiceChannel) {
              if (voiceChannel.id === player.voiceChannel.id) {
                return [check.name, cross.name].includes(reaction.emoji.name);
              }
              else {
                return false;
              }
            }
            else {
              return  false;
            }
          }

          try {
            const collector = await sentEmbed.createReactionCollector(filter, { max: votesRequired + 1, time: 30000, errors: ['time'] });

            collector.on('collect', (reaction, user) => {
              if (reaction.emoji.name === check.name) {
                yesVotes++;
              }
              else if (reaction.emoji.name === cross.name) {
                noVotes++;
              }
            });

            collector.on('end', (collection) => {
              if (yesVotes > noVotes) {
                player.setVolume(args[0])
                let bar = generateBar(args[0], full, empty);

                let embed = new MessageEmbed()
                  .setAuthor(`Vote Passed!`, `https://i.imgur.com/9r0jjcQ.png`)
                  .setTitle(`Volume Set: ${args[0]}`)
                  .setDescription(`${muted.toString()} ${bar} ${volume.toString()}`)

                  .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
                  .setTimestamp()

                sentEmbed.edit(embed);
                sentEmbed.reactions.removeAll(); 
              }
              else if (noVotes > yesVotes) {
                let bar = generateBar(player.volume, full, empty);

                let embed = new MessageEmbed()
                  .setAuthor(`Vote Denied!`, `https://i.imgur.com/9r0jjcQ.png`)
                  .setTitle(`Current Volume: ${player.volume}`)
                  .setDescription(`${muted.toString()} ${bar} ${volume.toString()}`)

                  .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
                  .setTimestamp()

                sentEmbed.edit(embed);
                sentEmbed.reactions.removeAll(); 
              }
              else {
                let bar = generateBar(player.volume, full, empty);

                let embed = new MessageEmbed()
                  .setAuthor(`Vote Denied!`, `https://i.imgur.com/9r0jjcQ.png`)
                  .setTitle(`Current Volume: ${player.volume}`)
                  .setDescription(`${muted.toString()} ${bar} ${volume.toString()}`)

                  .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
                  .setTimestamp()

                sentEmbed.edit(embed);
                sentEmbed.reactions.removeAll(); 
              }
            });
          }
          catch (error) {
            return message.channel.send(functions.sendEmbed(`🚫 Error`, `Times Up!`, `Vote has been canceled.`));
          }
        }
      }
    }
    else {
      let bar = generateBar(player.volume, full, empty);

      const volumeEmbed = new MessageEmbed()
        .setAuthor(`Current Volume: ${player.volume}`, `https://i.imgur.com/9r0jjcQ.png`)
        .setDescription(`${muted.toString()} ${bar} ${volume.toString()}`)

        .setFooter(`Requested by - ${message.author.username}`,message.author.avatarURL())
        .setTimestamp()
          
      return message.channel.send(volumeEmbed);
    }
  }
}

function generateBar(volume, full, empty) {
  let bar = ``,
    num = Math.round(volume / 10);

  for (let i = 0; i < num; i++) {
    bar += full.toString();
  }
  for (let i = 0; i < 10 - num; i++) {
    bar += empty.toString();
  }

  return bar;
}