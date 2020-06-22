const BaseEvent = require('../utils/structures/BaseEvent');
const { ErelaClient } = require("erela.js");
const nodes = [{
  host: "localhost",
  port: 1732,
  password: "De~Yuo",
}];

module.exports = class MusicEvent extends BaseEvent {
  constructor() {
    super('ready'); //TODO: Add music event to client for now we use another ready event
  }
  async run (client) {
    client.livePlaying = new Map();
    client.music = new ErelaClient(client, nodes)
    .on("nodeConnect", node => {
      client.resource.sendLive(client, process.env.LIVE_CHANNEL, `[INFO][MUSIC]`, `Connected to LavaLink Server\nEvent name: nodeConnect\n${node}`)
      console.log("[INFO][MUSIC] Connected to LavaLink Server")
    })
    .on("queueEnd", player => {
      client.resource.sendLive(client, process.env.LIVE_CHANNEL, `[INFO][MUSIC]`, `Queue completed\nEvent name: queueEnd`)
      player.textChannel.send(client.resource.embed()
        .setDescription(`The queue hath finshed sire. <@189238841054461952>`)
      )
      client.music.players.destroy(player.guild.id);
    })
    .on("trackStart", (player, track) => {
      client.resource.sendLive(client, process.env.LIVE_CHANNEL, `[INFO][MUSIC]`, `Song has been started.\nEvent name: trackStart`)
      console.log(`[INFO][MUSIC] - Song has been started.`)
    });
  }
}
