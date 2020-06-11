const BaseCommand = require('../../utils/structures/BaseCommand');
const Nekos = require('nekos.life')
const yae = new Nekos();

module.exports = class HugCommand extends BaseCommand {
  constructor() {
    super('hug', 'neko', [], 'Get a cool hug photo!');
  }

  async run(client, message, args) {
    //send loading embed
    let loading = await message.channel.send(client.resource.loading())
    let img = await yae.sfw.hug();

    try{
      if(message.mentions.users.first()){
        loading.edit(client.resource.embed()
          .setDescription(`<@${message.author.id}> hugged ${message.mentions.users.first()} **\\OwO/*`)
          .setImage(img.url)
        );
      }
      else{
        loading.edit(client.resource.embed()
          .setImage(img.url)
        );
      }
    } catch(e){
      console.log(`[ERROR] - (HUG) - Failed to retrieve image from API.`)
      loading.edit(client.resource.embed()
        .setTitle(`Failed. <:cross:694636239810330724>`)
        .setDescription('Failed: Error with retreiving photo. Please try again.')
      )
    }
    
  }
}