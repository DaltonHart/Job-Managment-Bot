// !assign
// - Create a "job" class and ID
// - Associate a "description" string
// - Associate "job" to an @user
// - Associate a due time to the "job"
// - Associate boolean "complete" to false
// !assign [description] [user] [due time] 

const axios = require("axios")
const Discord = require('discord.js');

module.exports = {
    name: 'assign',
    description: 'A command to check pricing of a stock symbol and return price along with news information.',
    args: true,
    usage: '<description><user><due date>',
    execute(message, args) {
        // console.log(args)
        let commandParts = message.content.split('"')
        let assignedUser = commandParts[2]
        let desc = commandParts[1]
        let dueDate = commandParts[3]

        const exampleEmbed = new Discord.RichEmbed()
            .setTitle(`Job Assigned`)
            .setTimestamp(new Date())
            .setColor(3447003)
            .addField(desc)
            .addField(`Due by **${dueDate}**`)

        message.channel.send(exampleEmbed);
    },
    
};