const { Command } = require('discord-akairo');
const util = require('util');
const logger = require("winston");

function clean(text) {
    if (typeof text === 'string')
        return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
    return text;
}

class EvalCommand extends Command {
    constructor() {
        super('eval', {
            aliases: ['eval', 'ev', 'e'],
            prefix: ["??", ">", "~"],
            description: { content: 'Evaluates text from agument.' },
            ownerOnly: true,
            protected: true,
            args: [{
                id: 'code',
                match: 'text'
            }]
        });
    }

    async exec(message, { code }) {
        logger.warn(`${message.author.tag} triggered eval.`, {
            code: code,
            id: message.author.id,
            fullContent: message.content,
            channel: message.channel.id,
            guild: message.guild.id
        });
        try {
            let evaled;
            if (evaled instanceof Promise) evaled = await eval(code);
            else evaled = eval(code);

            if (typeof evaled !== 'string')
                evaled = util.inspect(evaled);
            if (evaled.length >= 2000) evaled = `${evaled.slice(0, 1900)}...`;

            return message.channel.send(`**OUTPUT**\`\`\`xl\n${clean(evaled).includes(this.client.token) ? 'MzgwMjAy0WtgddsOpz5T0o3.H3hPzW10.GQSphbR34sdkIoep-iw4dcz9n4F' : clean(evaled)}\n\`\`\``);
        } catch (err) {
            return message.channel.send(`**ERROR**\`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
}

module.exports = EvalCommand;