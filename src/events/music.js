const BaseEvent = require('../utils/structures/BaseEvent');
const { ErelaClient } = require("erela.js");
const nodes = [{
  host: "localhost",
  port: 1732,
  password: "De~Yuo",
}];

module.exports = class MusicEvent extends BaseEvent {
  constructor() {
    super('ready'); //TODO: Add msuic event to client for now we use another ready event
  }
  async run (client) {
    client.livePlaying = new Map();
    client.music = new ErelaClient(client, nodes)
    .on("nodeConnect", node => console.log("[READY] Connected to LavaLink Server"))
    .on("queueEnd", player => {
      player.textChannel.send(client.resource.embed()
        .setDescription(`The queue hath finshed sire. <@189238841054461952>`)
      )
      client.music.players.destroy(player.guild.id);
    });
    // .on("trackStart", (player, track) => {
    //   client.livePlaying.set(`track`, track)
    //   player.textChannel.send(client.resource.embed()
    //     .setDescription(`Now playing: ${track.title}`)
    //   )
    // });
  }
}
