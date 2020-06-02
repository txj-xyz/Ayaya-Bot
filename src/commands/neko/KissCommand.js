const BaseCommand = require('../../utils/structures/BaseCommand');
const Nekos = require('nekos.life')
const yae = new Nekos();

module.exports = class KissCommand extends BaseCommand {
  constructor() {
    super('kiss', 'neko', [], 'Get a cool kissing photo!');
  }

  async run(client, message, args) {
    //send loading embed
    let loading = await message.channel.send(client.resource.loading())
    let img = await yae.sfw.kiss();
    try{
        if(message.mentions.users.first()){
          loading.edit(client.resource.embed()
            .setDescription(`<@${message.author.id}> kissed ${message.mentions.users.first()}`)
            .setImage(img.url)
          );
        }
        else{
          loading.edit(client.resource.embed()
            .setImage(img.url)
          );
        }
    } catch(e){
      console.log(`[ERROR] - (KISS) - Failed to retrieve image from API.`, e)
      loading.edit(client.resource.embed()
        .setTitle(`Failed. <:cross:694636239810330724>`)
        .setDescription('Failed: Error with retreiving photo. Please try again.')
      )
    }
    
  }
}