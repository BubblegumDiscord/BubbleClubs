const role = '437275430895222784'
const log = require("winston");
const discord = require("discord.js");
const { Client } = require("discord.js");
const update = 3000;
const steps = 18;

/**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   {number}  h       The hue
     * @param   {number}  s       The saturation
     * @param   {number}  l       The lightness
     * @return  {Array}           The RGB representation
     */
function hslToRgb(h, s, l){
  var r, g, b;

  if(s == 0){
      r = g = b = l; // achromatic
  }else{
    var hue2rgb = function hue2rgb(p, q, t){
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
} // black magic stack overflow code o_o https://stackoverflow.com/a/36722579



function calcColor() {
  var max = 360
  var now = (max / steps) * (Math.round(Date.now() / update) % steps);
  var min = 0
  var val = now
  var minHue = 0
  var maxHue = 360;
  var curPercent = (val - min) / (max-min);
  var rgbArray = hslToRgb(
    (Math.round(curPercent * (maxHue-minHue) ) + minHue) / max, 
    1,
    0.6
  );
  return rgbArray;
}

function calcHexColor() {
  return calcColor().map(c => c.toString(16)).join("")
}

/** @param {Client} client */
module.exports = (client) => {
  setInterval(() => {
    var c = calcHexColor();
    log.silly("Setting the hex color of the Multicolored role to " + c)
    client.guilds.get(global.bubblegum).roles.get(role).setColor(c)
  }, update)
}