const Discord = require('discord.js');
const db = require('../models')
const moment = require('moment')

module.exports = {
    name: 'enable',
    description: 'Enables a job based on the ID provided.',
    args: true,
    usage: '<job id>',
    execute(message, args) {
        let id = args[0]
        let updatedJob = {
            disbaled: false,
        }

        db.Job.findOneAndUpdate({_id:id},updatedJob,{new:true}, (err, found)=>{
            if (err) {
                console.log('ERROR', err)
              }
              const exampleEmbed = new Discord.RichEmbed()
              .setTimestamp(new Date())
              .setColor('#724B34')
              .setTitle(`Job enabled`)
              .setDescription(`Job ID: ${found._id}`)
  
          message.channel.send(`Job for ${found.user} has been enabled.`,exampleEmbed);
        })
    },
};