"use strict";

// Dependencies
let moment = require("moment");

// Utils
let config = require("../utils/configHandler").getConfig();

// Truly random seed, generated by putting trainee in front of vim and tell him to exit
const randomSeed = "AQa0B7HK4vvrBOlaKKplMsKorGhN4gJvOCBWxw531P8uwpeIU3d39ODZ02fbvcxiImOwAOuOtR4eaiPDkyTCbSqzKnaJWqp4AqwxOTMgU2UCPWKIH4WXCQzVq8M7oqWBF32KEAdAoXvAm5o3Wvl4MOwdMJk1LleFjv7mQJizltVw3Y2Tan88uc3JxoJurDTKvxBzRt6H";

/**
 * Index of Coincedence
 *
 * @param {string} s
 * @returns {number} index
 */
let iocCalculator = function(s){
    let bigrams = new Map();
    let text = s.replace(/\s+/g, "");
    [...text].forEach(c => (bigrams.has(c) ? bigrams.set(c, bigrams.get(c) + 1) : bigrams.set(c, 1)));

    let sum = 0;
    bigrams.forEach(v => (sum += v + (v - 1)));
    return sum / (text.length * (text.length - 1));
};

/**
 * Highly complex and very very secure
 *
 * @param {number} min
 * @param {number} max
 * @param {number} seed
 * @returns {number} random floored number >= min and <= max
 */
let rng = function(min, max, seed){
    let sido = (seed * 9301 + 49297) % 233280;
    let rnd = sido / 233280;
    let disp = Math.abs(Math.sin(sido));

    rnd = rnd + disp - Math.floor(rnd + disp);

    return Math.floor((min || 0) + rnd * ((max || 1) - (min || 0) + 1));
};

const ioc = iocCalculator(randomSeed);

/**
 * Highly complex, secure and optimized decision maker algorithm
 *
 * @param {string} question
 * @returns {number} decision
 */
let secureDecisionMaker = question => (rng(0, 1, (Date.now() * ioc) / iocCalculator(question)));

/**
 * Creates a new secure decision (sdm; yes/no)
 *
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} message
 * @param {array} args
 * @param {Function} callback
 * @returns {Function} callback
 */
exports.run = (client, message, args, callback) => {
    if (!args.length) return callback("Bruder da ist keine Frage :c");

    let question = args.join(" ").replace(/\s\s+/g, " ");
    if (!question.endsWith("?")) question += "?";

    const image = !!secureDecisionMaker(question) ? "yes.png" : "no.png";

    let embed = {
        embed: {
            description: `**${question}**`,
            timestamp: moment.utc().format(),
            thumbnail: {
                url: `attachment://${image}`,
            },
            author: {
                name: `Secure Decision für ${message.author.username}`,
                icon_url: message.author.displayAvatarURL(),
            },
        },
        files: [`./assets/${image}`],
    };

    message.channel
        .send(/** @type {any} embed */ (embed))
        .then(() => message.delete());

    return callback();
};

exports.description = `Macht eine Secure Decision (ja/nein) mithilfe eines komplexen, hochoptimierten, Blockchain Algorithmus.\nUsage: ${config.bot_settings.prefix.command_prefix}sdm [Hier die Frage]`;
