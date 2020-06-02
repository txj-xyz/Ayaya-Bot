const BaseCommand = require('../../utils/structures/BaseCommand');
const { reloadCommands } = require('../../utils/registry');

module.exports = class ReloadCommand extends BaseCommand {
  constructor() {
    super('reload', 'owner', [], 'Reload commands with this!');
  }

  async run(client, message, args) {

    let loading = await message.channel.send(client.resource.loading());
    try{
      reloadCommands(client)
    }catch(e){
      console.log(`WOW DATA: ` + e)
    }
    
    loading.edit(client.resource.embed()
      .setTitle(`Success! <:check:694636220571189389>`)
      .setDescription(`Reloaded \`${client.commands.size}\` commands.`)
    );
  }
}