const BaseCommand = require('../../utils/structures/BaseCommand');
const { find } = require('weather-js');

module.exports = class WeatherCommand extends BaseCommand {
  constructor() {
    super('weather', 'general', [], 'Show weather for your area');
  }

  async run(client, message, args) {
    let loading = await message.channel.send(client.resource.loading())
    if(!args) return loading.edit(client.resource.embed(),setDescription(`Please provide a string to search (eg.\`Gilbert,AZ\` or \`Gilbert\`)`))
    find({search: String(args.join(" ")), degreeType: 'F'}, (err, data) => {
      let { current } = data[0];
      if(!args) return;
      if(err) return loading.edit(client.resource.embed().setDescription(`There was an error with your request, please try this again, perhaps check the details of what you're searching.`));
      if(!data[0]) return loading.edit(client.resource.embed().setDescription(`No data was found for \`${args.join(" ")}\`, please try your search again.`))
    )
      loading.edit(client.resource.embed()
        .setTitle(`Weather for ${data[0].location.name}`)
        .setFooter(`Scanned at: ${current.observationtime}`)
        .setThumbnail(current.imageUrl)
        .setDescription(`
          Temperature: ${current.temperature}F
          Currently: ${current.skytext}
        
          Feels Like: ${current.feelslike}
          Humidity: ${current.humidity}%
          Wind: ${current.winddisplay}
        `)
      );
    });
  }
}