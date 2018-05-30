const { Command } = require('discord-akairo')
const discord = require('discord.js')
// const { Message } = discord
const log = require('winston')

function tm (ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms)
  })
}

class JoinCommand extends Command {
  constructor () {
    super('join', {
      aliases: ['join'],
      description: { content: 'Joins you to a club.' },
      args: [{
        id: 'club'
      }]
    })
  }
  /**
    * @param {Message} message The message the user sent
    * @param {String} club The club they wish to join
    */
  async exec (message, { club }) {
    var clubs = { }
    require('../../../data/clubs.json').forEach(club => { clubs[club.name] = club.role })
    var flavors = require('../../../data/flavors.json').map(role => role.role)
    var tempMap = {gum: 'Gum', lollipop: 'Lollipop'}
    if (tempMap[club.toLowerCase()]) {
      var roleName = tempMap[club.toLowerCase()]
      var roleId = clubs[roleName]
      var toRemoveRoles = []
      toRemoveRoles = toRemoveRoles.concat(flavors)
      toRemoveRoles = toRemoveRoles.concat(Object.keys(clubs).map(k => clubs[k]))
      toRemoveRoles = toRemoveRoles.concat(require("../../../data/traits.json").map(t => t.role))
      toRemoveRoles.forEach(async roleToRemove => {
        if (message.member.roles.has(roleToRemove)) {
          log.silly(`Removed the role ${roleToRemove} from ${message.member.id}.`)
          await message.member.removeRole(roleToRemove)
        } else {
          log.silly(`Don't need to remove ${roleToRemove} from ${message.member.id}`)
        }
      })
      await tm(300)
      if (message.member.roles.has('334803162030407680')) message.member.removeRole('334803162030407680')
      await message.member.addRole(roleId)
      log.silly(`Added the ${roleName} role to ${message.member.id}.`)
      await message.channel.send(
        new discord.RichEmbed()
          .setTitle(`You are now part of the ${roleName} club!`)
          .setDescription('fancy!')
          .setColor(message.member.displayHexColor)
          .addField(`To see the different flavors`, `just type \`!flavors\` and you'll see a list and instructions to join them - To see all available traits type \`!traits\`!`)
          .setTimestamp(new Date())
          .setAuthor(message.author.tag, message.author.displayAvatarURL)
      )
    }
  }
}

module.exports = JoinCommand
