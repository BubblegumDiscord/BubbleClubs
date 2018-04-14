const { Command } = require('discord-akairo')
const discord = require('discord.js')
// const { Message } = discord
const log = require('winston')

class JoinCommand extends Command {
  constructor () {
    super('remflavor', {
      aliases: ['remflavor', 'removeflavor', 'remove', 'gtfo'],
      description: { content: 'Removes you from a flavor role.' },
      args: [{
        id: 'flavor',
        description: 'The flavor you want to remove',
        type: 'role',
        match: 'text'
      }]
    })
  }
  /**
    * @param {Message} message The message the user sent
    * @param {String} club The club they wish to join
    */
  async exec (message, { flavor }) {
    var flavors = require('../../../data/flavors.json')
    var flavorObject = flavors.filter(f => f.role === flavor.id)
    if (!flavor || flavorObject.length < 1) {
      return message.channel.send(
        new discord.RichEmbed()
          .setTitle("That's not a valid flavor :( ")
          .setDescription('Try `!flavors` to see what flavors are available to you')
          .setTimestamp(new Date())
          .setFooter(message.author.tag, message.author.displayAvatarURL)
          .setColor(0xFF0000)
      )
    }
    await message.member.removeRole(flavor)
    log.silly(`Added the ${flavor.id} (${flavor.name}) role to ${message.member.id}.`)
    await message.channel.send(
      new discord.RichEmbed()
        .setTitle(`I've removed the ${flavor.name} role`)
        .setDescription(':ok_hand:')
        .setColor(message.member.displayHexColor)
        .setTimestamp(new Date())
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
    )
  }
}

module.exports = JoinCommand
