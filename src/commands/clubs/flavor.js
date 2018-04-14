const { Command } = require('discord-akairo')
const discord = require('discord.js')
// const { Message } = discord
const log = require('winston')

var clubs = require('../../../data/clubs.json')

function findClub (member) {
  var foundClub = null
  clubs.forEach(club => {
    if (member.roles.has(club.role)) foundClub = club.name
  })
  return foundClub
}

function tm (ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms)
  })
}

class JoinCommand extends Command {
  constructor () {
    super('flavor', {
      aliases: ['flavor'],
      description: { content: 'Joins you to a flavor role.' },
      args: [{
        id: 'flavor',
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

    var memberClub = findClub(message.member)
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
    flavorObject = flavorObject[0]

    if (flavorObject.club !== memberClub) {
      return message.channel.send(
        new discord.RichEmbed()
          .setTitle(`That flavor isn't available to you :(`)
          .setDescription(`That flavor is only available to the \`${flavorObject.club}\` club.`)
          .setTimestamp(new Date())
          .setColor(0xFF0000)
          .setFooter(message.author.tag, message.author.displayAvatarURL)
      )
    }

    var toRemoveRoles = flavors.map(role => role.role)

    toRemoveRoles.forEach(async roleToRemove => {
      if (message.member.roles.has(roleToRemove)) {
        log.silly(`Removed the role ${roleToRemove} from ${message.member.id}.`)
        await message.member.removeRole(roleToRemove)
      } else {
        log.silly(`Don't need to remove ${roleToRemove} from ${message.member.id}`)
      }
    })

    await tm(100)

    await message.member.addRole(flavor)
    log.silly(`Added the ${flavor.id} (${flavor.name}) role to ${message.member.id}.`)
    await message.channel.send(
      new discord.RichEmbed()
        .setTitle(`You have been given the ${flavor.name} role`)
        .setDescription('noice!')
        .addBlankField()
        .addField(`To remove it`, `join another flavor or use \`!removeflavor ${flavor.name}\``)
        .setColor(message.member.displayHexColor)
        .setTimestamp(new Date())
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
    )
  }
}

module.exports = JoinCommand
