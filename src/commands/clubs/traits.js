const { Command } = require('discord-akairo')
const discord = require('discord.js')
// const { Message } = discord
const log = require('winston')
var traits = require('../../../data/traits.json')
var clubs = require('../../../data/clubs.json')

function findClub (member) {
  var foundClub = null
  clubs.forEach(club => {
    if (member.roles.has(club.role)) foundClub = club
  })
  return foundClub
}
function getCurrentOrder(member) {
    function findTraitFromRole(r) {
        var found = null;
        traits.forEach(t => {
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
    super('traits', {
      aliases: ['traits'],
      description: { content: 'Shows available traits.' }
    })
  }
  /**
    * @param {Message} message The message the user sent
    */
  async exec (message) {
    if (!message.member.roles.some(r => clubs.map(c => c.role).includes(r.id))) {
      log.info(`${message.author.id} tried to use !traits without a club lol rip them`)
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
    var emb = 
        new discord.RichEmbed()
            .setImage(theirClub.girl_image)
            .setTitle(`${theirClub.girl}'s trait shop`)
            .setColor(0xff178c)
    var current = getCurrentOrder(message.member);
    var stop = false;
    appropriateTraits.forEach(trait => {
        if (stop) return;
        var trait_role = message.guild.roles.get(trait.role);
        if (trait.order > (current + 1)) { 
            stop = !stop
            return emb.addField(
                String.fromCharCode(8203),
                `:question: This trait and all traits after it are still *under wraps* :D. Unlock it by purchasing the trait before it!`
            );
        }
        emb.addField(
            String.fromCharCode(8203), 
            ((trait.order <= current) ? "~~" : "") + `<@&${trait.role}> - type \`!buytrait\` to get this - ` + (trait.cost ? `${trait.cost} <a:sugargif:408339899163344896> ` : `free!`) + ((trait.order <= current) ? "~~" : "")
        )
    })
    await message.channel.send(emb)
  }
}

module.exports = TraitsCommand
