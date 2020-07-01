const BaseCommand = require('../../utils/structures/BaseCommand');
const humanizeDuration = require('humanize-duration')
const { unlink } = require('fs'); // We are using the async unlink function from fs to remove a file

module.exports = class DeleteCommand extends BaseCommand {
  constructor() {
    super('delete', 'owner', ['rm'], 'Removes an uploaded ShareX image.');
  }

  async run(client, message, args) {
    if(!args) return message.react(`🙅‍♂️`);
    let loading = await message.channel.send(client.resource.loading());

    unlink(`${process.env.SCREEN_SHOT_DIRECTORY}${args[0]}`, (err) => {
      if (err) {
        loading.edit(client.resource.embed()
        .setTitle('Error: File Already Deleted')
        .setColor('#03a9fc')
        .setTimestamp()
        .setDescription(
          `**File Requested**: \`${args[0]}\`\n`+
          `**Deleted?**: 👎\n`+
          `**Status**: \`File has already been removed or does not exist.\`\n`+
          `**Requested By**:\n\`\`\`js\n${require(`util`).inspect(message.author, { depth: 0 })}\n\`\`\``)
        )
        console.error(err)
        return;
      }
      loading.edit(client.resource.embed()
      .setTitle('File Deleted')
      .setColor('#03a9fc')
      .setTimestamp()
      .setDescription(
        `**File Requested**: \`${args[0]}\`\n`+
        `**Deleted?**: 👍\n`+
        `**Requested By**:\n\`\`\`js\n${require(`util`).inspect(message.author, { depth: 0 })}\n\`\`\``)
      )
    })
  }
}