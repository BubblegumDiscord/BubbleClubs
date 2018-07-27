var economy = require("./economy")
var logger = require("winston")
module.exports = async (client) => {
    var bubblegum = client.guilds.get("334629377440481280")
    bubblegum.channels
        .filter( c => c.type === "voice" )
        .forEach(async c => {
            try { await economy.award(c, Math.floor((7000 / 60) / 6)) }
            catch (e) { logger.debug(e) }
        })
}