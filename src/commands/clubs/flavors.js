const { Command } = require('discord-akairo')
const discord = require('discord.js')
// const { Message } = discord
const log = require('winston')
var flavors = require('../../../data/flavors.json')
var clubs = require('../../../data/clubs.json')

function findClub (member) {
  var foundClub = null
  clubs.forEach(club => {
    if (member.roles.has(club.role)) foundClub = club.name
  })
  return foundClub
}

class JoinCommand extends Command {
  constructor () {
    super('flavors', {
      aliases: ['flavors'],
      description: { content: 'Shows available flavors.' }
    })
  }
  /**
    * @param {Message} message The message the user sent
    * @param {String} club The club they wish to join
    */
  async exec (message, { club }) {
    if (!message.member.roles.some(r => clubs.map(c => c.role).includes(r.id))) {
      log.info(`${message.author.id} tried to use ??flavors without a club lol rip them`)
      return message.channel.send(
        new discord.RichEmbed()
          .setTitle("You're not in a club!")
          .setDescription('Use the command `??join [' + clubs.map(c => c.name).join('/') + ']` to join a club.')
          .setColor(message.member.displayHexColor)
          .setTimestamp(new Date())
          .setFooter(message.author.tag, message.author.displayAvatarURL)
      )
    }
    var theirClub = findClub(message.member)
    var appropriateFlavors = flavors.filter(f => f.club === theirClub)
    var emb =
      new discord.RichEmbed()
        .setTitle('Available flavors:')
        .setDescription('mmm tasty')
        .setTimestamp(new Date())
        .setColor(message.member.displayHexColor)
        .setFooter(message.author.tag, message.author.displayAvatarURL)
    appropriateFlavors.forEach(fl => {
      emb.addField(
        message.guild.roles.get(fl.role).name,
        `<@&${fl.role}>`
      )
    })
    emb.addBlankField()
    emb.addField('To join a flavor', `just type \`!flavor \` then part of the name of the flavor you want.`)
    await message.channel.send(emb)
  }
}

module.exports = JoinCommand
