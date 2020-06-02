const BaseCommand = require('../../utils/structures/BaseCommand');
const Nekos = require('nekos.life')
const yae = new Nekos();

module.exports = class LizardCommand extends BaseCommand {
  constructor() {
    super('lizard', 'neko', [], 'Get a cool photo of a lizard!');
  }

  async run(client, message, args) {
    //send loading embed
    let loading = await message.channel.send(client.resource.loading())
    let img = await yae.sfw.lizard();

    try{
      loading.edit(client.resource.embed()
        .setImage(img.url)
      );
    } catch(e){
      console.log(`[ERROR] - (LIZARD) - Failed to retrieve image from API.`)
      loading.edit(client.resource.embed()
        .setTitle(`Failed. <:cross:694636239810330724>`)
        .setDescription('Failed: Error with retreiving photo. Please try again.')
      )
    }
  }
}