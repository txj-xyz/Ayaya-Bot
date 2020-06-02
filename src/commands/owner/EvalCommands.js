const BaseCommand = require('../../utils/structures/BaseCommand');
const util = require('util')
const Discord = require('discord.js')

module.exports = class EvalCommand extends BaseCommand {
  constructor() {
    super('eval', 'owner', [], 'Eval code as the client');
  }

  async run(client, message, args) {
    let code = args.join(" ");
    if (!code) return;

    try {
        let evaled = clean(await eval(code)), output = `📤 Output`;
        if (evaled.length > 800) evaled = evaled.substring(0, 800) + `...`;

        return message.channel.send(
            client.resource.embed()
            .addField(`📥 Input`, `\`\`\`\n${code}\n\`\`\``)
            .addField(output, `\`\`\`js\n${evaled}\n\`\`\``)
            .addField(`Status`, `Success`)
        );
    }
    catch (e) {
        return message.channel.send(client.resource.embed()
            .addField(`📥 Input`, `\`\`\`\n${code}\n\`\`\``)
            .addField(`📤 Output`, `\`\`\`js\n${e}\n\`\`\``)
            .addField(`Status`, `Failed`)
        );
    }
    
    function clean(text) {
        if (typeof text !== `string`)
            text = require(`util`).inspect(text, { depth: 0 })
        let rege = new RegExp(process.env.DISCORD_BOT_TOKEN, "gi");
        if(text == process.env.DISCORD_BOT_TOKEN) return text = "Here is your token: ||[REDACTED]||"
        return text;
    }
  }
}