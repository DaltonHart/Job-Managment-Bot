//!show JobID to just summon that text block

//!transfer "jobID" @newusername

// !done job#
// - Change "complete" boolean of job to true
const Discord = require('discord.js');
const db = require('../models')
const moment = require('moment')

module.exports = {
    name: 'show',
    description: 'Show a specific Job.',
    args: true,
    usage: '<job id>',
    execute(message, args) {
        let id = args[0]
        
        db.Job.findOne({_id:id}).exec((err, found)=>{
            if (err) {
                console.log('ERROR', err)
               return message.channel.send(`Invalid id entered.`);
              } else {
                let date = moment(found.dueTime).format('MMM Do YY')
                const exampleEmbed = new Discord.RichEmbed()
                .setTimestamp(new Date())
                .setColor('#724B34')
                .setTitle(`Job`)
                .setDescription(`Job ID: ${found._id}`)
                .addField(`TODO:`,`${found.description}`, false)
                .addField(`COMPLETE:`, `${found.complete}`, true)
                .addField(`DUE:`,`${date}`, true)
  
          message.channel.send(`${found.user} Job`,exampleEmbed);
              }
              
        })
    },
    
};