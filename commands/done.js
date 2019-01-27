// !done job#
// - Change "complete" boolean of job to true
const Discord = require('discord.js');
const db = require('../models')
const moment = require('moment')
const client = new Discord.Client();

module.exports = {
    name: 'done',
    description: 'Sets if "Complete" of Job to True.',
    args: true,
    usage: '<job id>',
    execute(message, args) {
        let id = args[0]

        let updatedJob = {
            complete: true
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
                .setTitle(`Job Completed`)
                .setDescription(`Job ID: ${found._id}`)
                .addField(`TODO:`,`${found.description}`, false)
                .addField(`COMPLETE:`, `${found.complete}`, true)
                .addField(`DUE:`,`${date}`, true)
  
          message.channel.send(`${found.user} Job has been Completed.`,exampleEmbed);
          client.channels.get("493242085831475210").send(`${found.user} Job has been Completed.`,exampleEmbed)


              }
              
        })
    },
    
};