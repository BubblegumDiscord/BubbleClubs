/*
~eval var id = "211005431903027200";

var member = message.guild.members.get(id).user

message.channel.send(new (require("discord.js")).RichEmbed().setThumbnail(member.displayAvatarURL).setTitle(member.tag).setDescription("Vote :thumbsup: or :thumbsdown: ").setFooter("Reminder: You may only vote for one person. Your votes will not be counted if you vote for more than one person").setColor(0xff178c)).then(m => m.react("\:thumbsup:") && m.react("\:thumbsdown:"))
*/
const { Command } = require('discord-akairo')
const discord = require('discord.js')
// const { Message } = discord
const log = require('winston')
const fs = require("fs")


class JoinCommand extends Command {
  constructor () {
    super('makevote', {
      aliases: ['makevote'],
      description: { content: 'Makes a vote.' },
      userPermissions: ["ADMINISTRATOR"],
      args: [{
        id: 'person',
        type: 'member'
      }]
    })
  }
  /**
    * @param {Message} message The message the user sent
    * @param {String} club The club they wish to join
    */
  async exec (message, { person }) {
    var votes = JSON.parse(fs.readFileSync("./data/votes.json", "utf-8"))
    if (!votes.hasOwnProperty(message.channel.id)) {
        votes[message.channel.id] = {}
    }
    if (votes[message.channel.id].hasOwnProperty(person.id)) {
        var m = await message.channel.send("There was already a vote for that person. deleting old vote")
        setTimeout( () => { m.delete() && console.log(m) }, 3000)
        var voteM = await message.channel.fetchMessage(votes[message.channel.id][person.id]);
        await voteM.delete()
        delete votes[message.channel.id][person.id]
    }
    var member = person.user;
    var m2 = await message.channel.send(
        new discord.RichEmbed()
        .setThumbnail(member.displayAvatarURL)
        .setTitle(member.tag)
        .setDescription("React :point_up_2: to vote for " + member.username)
        .setFooter("Reminder: You may only vote for one person. Your votes will not be counted if you vote for more than one person")
        .setColor(0xff178c))
    m2.react("👆")
    votes[message.channel.id][person.id] = m2.id
    fs.writeFileSync("./data/votes.json", JSON.stringify(votes, null, 2))
  }
}

module.exports = JoinCommand
