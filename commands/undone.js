// !undone job#
// - Change "complete" boolean of job to false
const Discord = require('discord.js');
const db = require('../models')
const moment = require('moment')

module.exports = {
    name: 'undone',
    description: 'Sets if "Complete" of Job to false.',
    args: true,
    usage: '<job id>',
    execute(message, args) {
        let id = args[0]

        let updatedJob = {
            complete: false,
            completedBy: 'NA',
            completedOn: new Date()
        }

        db.Job.findOneAndUpdate({_id:id},updatedJob,{new:true}, (err, found)=>{
            if (err) {
                console.log('ERROR', err)
               return message.channel.send(`Invalid id entered.`);
              }
              let date = moment(found.dueTime).format('MMM Do YYYY')
              const exampleEmbed = new Discord.RichEmbed()
              .setTimestamp(new Date())
              .setColor('#724B34')
              .setTitle(`Job Completed`)
              .setDescription(`Job ID: ${found._id}`)
              .addField(`TODO:`,`${found.description}`, false)
              .addField(`COMPLETE:`, `${found.complete}`, true)
              .addField(`DUE:`,`${date}`, true)
  
          message.channel.send(`${found.user} Job is not complete.`,exampleEmbed);
        })
    },
};