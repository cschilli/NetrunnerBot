var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xmlHttp = new XMLHttpRequest();
var cardFoundCounter;
var cleanedArray;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});


bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        // args becomes everything from index 1 onwards split by spaces
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);

        function arrayUnique(arr) {
            var cleaned = [];
            arr.forEach(function(itm) {
                var unique = true;
                cleaned.forEach(function(itm2) {
                    if (itm.title === itm2.title){
                        unique = false;
                    }
                });
                if (unique){
                    cleaned.push(itm);
                }
            });
            return cleaned;
        }


        function findCard(args, cleanArr){
            var foundCard;
            cardFoundCounter = 0;
            for(var i = 0; i < cleanArr.length; i++)
            {
                if (cleanArr[i].title.indexOf( args ) > -1 ) {
                    foundCard = cleanArr[i].code;
                    cardFoundCounter++;
                }
            }
            return foundCard;
        }

        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                })
                break;// Just add any case commands if you want to..
            case 'discourage':
                bot.sendMessage({
                    to: channelID,
                    message: 'You are smelly, ' + args[0] + '!'
                })
                break;
            case 'encourage':
                bot.sendMessage({
                    to: channelID,
                    message: 'You are simply the best, ' + args[0] + '!'
                })
                break;
            case 'card':
                xmlHttp.open("GET", "https://netrunnerdb.com/api/2.0/public/cards", false);
                xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xmlHttp.send();
                var response = JSON.parse(xmlHttp.responseText);

                if (!cleanedArray){
                    cleanedArray = arrayUnique(response.data);
                }

                var cardName = message.substring(6, message.length);
                if (cardName.length > 2) {
                    var cardCode = findCard(cardName, cleanedArray);
                }

                if (cardFoundCounter === 1 && cardCode) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'https://netrunnerdb.com/card_image/' + cardCode + '.png'
                    })
                }else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Nothing found! Check your spelling and capitalization and remember I need at least 3 characters.'
                        })
                    }
                    break;
        }
    }
});