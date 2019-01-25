//!transfer "jobID" @newusername

// !done job#
// - Change "complete" boolean of job to true
const Discord = require('discord.js');
const db = require('../models')
const moment = require('moment')

module.exports = {
    name: 'transfer',
    description: 'Transfers ownership of a job.',
    args: true,
    usage: '<job id><tagged user>',
    execute(message, args) {
        let id = args[0]
        let newUser = args[1]
        let updatedJob = {
            user: newUser
        }

        db.Job.findOneAndUpdate({_id:id},updatedJob,{new:true}, (err, found)=>{
            if (err) {
                console.log('ERROR', err)
               return message.channel.send(`Invalid id entered.`);
              } else {
                let date = moment(found.dueTime).format('MMM Do YY')
                const exampleEmbed = new Discord.RichEmbed()
                .setTimestamp(new Date())
                .setColor('#724B34')
                .setTitle(`Job transfered`)
                .setDescription(`Job ID: ${found._id}`)
                .addField(`TODO:`,`${found.description}`, false)
                .addField(`COMPLETE:`, `${found.complete}`, true)
                .addField(`DUE:`,`${date}`, true)
  
          message.channel.send(`Job has been transfered to ${found.user}`,exampleEmbed);
              }
              
        })
    },
    
};