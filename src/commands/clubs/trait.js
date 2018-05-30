const { Command } = require('discord-akairo')
const discord = require('discord.js')
// const { Message } = discord
const log = require('winston')
var traits = require('../../../data/traits.json')
var clubs = require('../../../data/clubs.json')
const economy = require("../../helpers/economy");

function findClub (member) {
  var foundClub = null
  clubs.forEach(club => {
    if (member.roles.has(club.role)) foundClub = club
  })
  return foundClub
}
function getCurrentOrder(member) {
    var club = findClub(member)
    var iTraits = traits.filter(t => t.club == club.name)
    function findTraitFromRole(r) {
        var found = null;
        iTraits.forEach(t => {
            if (t.role == r.id) found = t
        })
        return found
    }
    var current = 0;
    member.roles.forEach(r => {
        var trait = findTraitFromRole(r);
        if (!trait) return;
        if (trait.order > current) current = trait.order
    })
    return current
}

class TraitsCommand extends Command {
  constructor () {
    super('nexttrait', {
      aliases: ['nexttrait', 'buytrait'],
      description: { content: 'Purchases a trait.' }
    })
  }
  /**
    * @param {Message} message The message the user sent
    */
  async exec (message) {
    if (!message.member.roles.some(r => clubs.map(c => c.role).includes(r.id))) {
      log.info(`${message.author.id} tried to use !nexttrait without a club lol rip them`)
      return message.channel.send(
        new discord.RichEmbed()
          .setTitle("You're not in a club!")
          .setDescription('Use the command `!join [' + clubs.map(c => c.name).join('/') + ']` to join a club.')
          .setColor(message.member.displayHexColor)
          .setTimestamp(new Date())
          .setFooter(message.author.tag, message.author.displayAvatarURL)
      )
    }
    var theirClub = findClub(message.member)
    var appropriateTraits = traits.filter(f => f.club === theirClub.name)
    var traitToBuy = null;
    var current = getCurrentOrder(message.member);
    appropriateTraits.forEach(trait => {
        if ((current + 1) == trait.order) {
          traitToBuy = trait
        }
    })
    if (!traitToBuy) {
      return message.channel.send(
        new discord.RichEmbed()
        .setTitle("You have bought all the traits!")
        .setColor(0x6b3fa0)
        .setDescription("There isn't a next trait :(.")
        .setThumbnail(theirClub.girl_image)
      )
    }
    try {
      var currentBal = await economy.getBal(message.author.id)
    } catch (e) {
      return message.channel.send("I couldn't access your balance. Please type `$$` and this issue should be fixed")
    }
    var trait_role = message.guild.roles.get(traitToBuy.role);
    if (currentBal < traitToBuy.cost) {
      return message.channel.send(
        new discord.RichEmbed()
        .setTitle("A little too healthy o_o")
        .setColor(0x6b3fa0)
        .setDescription("You don't have enough sugar! The `"+ trait_role.name +"` trait costs `" + traitToBuy.cost + "` and you only have `" + currentBal + "`.")
      )
    }
    await economy.take(message.author.id, traitToBuy.cost)
    message.member.addRole(trait_role)
    message.channel.send(
      new discord.RichEmbed()
      .setTitle("I've given you the " + trait_role.name + " trait" + (traitToBuy.cost ? " and taken away " + traitToBuy.cost + " sugar!" : ""))
      .setColor(0x6b3fa0)
      .setDescription("Enjoy")
      .setThumbnail(theirClub.girl_image)
    )

  }
}

module.exports = TraitsCommand
