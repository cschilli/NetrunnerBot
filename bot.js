var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xmlHttp = new XMLHttpRequest();

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

        function findCard(args){
            var foundCard;
            for(var i = 0; i < response.data.length; i++)
            {
                if(response.data[i].title === args)
                {
                    foundCard = response.data[i].code;
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
                var sanitaryArgs = message.substring(6, message.length);

                xmlHttp.open("GET", "https://netrunnerdb.com/api/2.0/public/cards", false);
                xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xmlHttp.send();
                var response = JSON.parse(xmlHttp.responseText);

                var cardName = sanitaryArgs;
                var cardCode = findCard(cardName);

                if (cardCode) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'https://netrunnerdb.com/card_image/' + cardCode + '.png'
                    })
                }
                else{
                    bot.sendMessage({
                        to: channelID,
                        message: 'Nothing found! Check your spelling!'
                    })
                }
                break;
        }
    }
});