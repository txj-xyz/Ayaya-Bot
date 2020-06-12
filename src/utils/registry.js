
const path = require('path');
const fs = require('fs').promises;
const BaseCommand = require('./structures/BaseCommand');
const BaseEvent = require('./structures/BaseEvent');

async function registerCommands(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);

  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerCommands(client, path.join(dir, file)); //TODO: POSSIBLY REWRITE THIS, this gets called 5 times beacuse of the folder layout
    if (file.endsWith('.js')) {
      try{
        Command = require(path.join(filePath, file));
      }
      catch{
        //console.log(`BEFORE SET REGISTER COMMAND:`, client.loadfail)
        client.loadfail = [];
        client.loadfail.push(`${file.substring(0, file.length-3)} - LOAD FAILED`)
        //console.log(`AFTER SET REGISTER COMMAND:`, client.loadfail)
        console.log(`[ERROR] Loading Failed - [${file.substring(0, file.length-3)}]`);
        return;
      }
      if (Command.prototype instanceof BaseCommand) {
        const cmd = new Command();
        client.commands.set(cmd.name, cmd);
        console.log(`[INFO] Loaded - [${cmd.name} - ${cmd.description}]`)
        //Setup alias registry here
        setTimeout(()=>{
          cmd.aliases.forEach(async (alias) => {
            client.alias.set(alias, cmd);
            console.log(`[INFO] Loaded alias - [${alias}]`)
          });
        }, 150)
      }
    }
  }
}

async function reloadCommands(client, dir = '../commands') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) reloadCommands(client, path.join(dir, file));
    if (file.endsWith('.js')) {
      try{
        delete require.cache[require.resolve(path.join(filePath, file))]
        Command = require(path.join(filePath, file));
      }catch{
        client.loadfail.push(`${file.substring(0, file.length-3)} - RELOAD FAILED`)
        console.log(`[ERROR] Reloading Failed -  [${file.substring(0, file.length-3)}]`);
        return;
      }
      if (Command.prototype instanceof BaseCommand) {
        const cmd = new Command();
        await client.commands.set(cmd.name, cmd);
        console.log(`[INFO] Reloaded - [${cmd.name}]`)
        setTimeout(()=>{
          cmd.aliases.forEach(async (alias) => {
            delete require.cache[require.resolve(path.join(filePath, file))]
            await client.alias.set(alias, cmd);
            console.log(`[INFO] Reloaded alias - [${alias}]`)
          });
        }, 150)
      }
    }
  }
}

async function registerEvents(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
    if (file.endsWith('.js')) {
      const Event = require(path.join(filePath, file));
      if (Event.prototype instanceof BaseEvent) {
        const event = new Event();
        client.events.set(event.name, event);
        client.on(event.name, event.run.bind(event, client));
      }
    }
  }
}

module.exports = { 
  registerCommands, 
  registerEvents,
  reloadCommands,
};