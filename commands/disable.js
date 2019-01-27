const Discord = require('discord.js');
const db = require('../models')
const moment = require('moment')

module.exports = {
    name: 'disable',
    description: 'Disables a job based on the ID provided.',
    args: true,
    usage: '<job id>',
    execute(message, args) {
        let id = args[0]
        let updatedJob = {
            disabled: true
        }

        db.Job.findOneAndUpdate({_id:id},updatedJob,{new:true}, (err, found)=>{
            if (err) {
                console.log('ERROR', err)
              }
              const exampleEmbed = new Discord.RichEmbed()
              .setTimestamp(new Date())
              .setColor('#724B34')
              .setTitle(`Job disabled`)
              .setDescription(`Job ID: ${found._id}`)
  
          message.channel.send(`Job assigned to ${found.user} has been disabled.`,exampleEmbed);
        })
    },
};