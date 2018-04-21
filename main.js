const { AkairoClient } = require('discord-akairo')
var logger = require('./src/log.js')
var discord = require('discord.js')
var { Client, Message } = discord
var { Command } = require('discord-akairo')
const noop = () => { }
noop(Client, Message, Command)

global.conf = require('./data/config.json')
global.bubblegum = "334629377440481280"

const client = new AkairoClient({
  ownerID: '193053876692189184',
  prefix: ['??', '~', '!'],
  commandDirectory: './src/commands/'
})

client.login(global.conf.token).then(() => {
  logger.info(`Connected to discord as ${client.user.username}.`, {
    bot_id: client.user.id,
    connected_guilds: client.guilds.size
  })
})

client.on("ready", () => {
  logger.info("Adding multicolouredrole listener")
  require("./src/multicoloredrole")(client)
  logger.debug("done adding it")
})

client.commandHandler.on('commandStarted',
  /**
     * @param {Message} message The message that was sent by the user
     * @param {Command} command The command that was executed
     */
  (message, command, edited) => {
    logger.info(`The command ${command.id} was executed by ${message.author.tag} in ${message.guild.name}.`, {
      author: message.author.id,
      guild: message.guild.id,
      channel: message.channel.id,
      content: message.content,
      message: message.id
    })
  })


process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});