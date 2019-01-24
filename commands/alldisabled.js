// !assign
// - Create a "job" class and ID
// - Associate a "description" string
// - Associate "job" to an @user
// - Associate a due time to the "job"
// - Associate boolean "complete" to false
// !assign [description] [user] [due time] 

const Discord = require('discord.js');
const db = require('../models')
const moment = require('moment')

module.exports = {
    name: 'alldisabled',
    description: 'A command to to show all disbaled jobs.',
    args: false,
    usage: '',
    execute(message, args) {

        db.Job.find({disabled:true}).exec((err,jobs)=>{
            if (err) {
                console.log('ERROR', err)
            }
            console.log(jobs)
            jobs.forEach((job)=>{
                let date = moment(job.dueTime).format('MMM Do YY')
                const exampleEmbed = new Discord.RichEmbed()
                  .setTimestamp(new Date())
                  .setColor('#724B34')
                  .setTitle(`Job`)
                  .setDescription(`Job ID: ${job._id}`)
                  .addField(`TODO:`,`${job.description}`, true)
                  .addField(`COMPLETE:`, `${job.complete}`, true)
                  .addField(`DUE:`,`${date}`, true)
      
              message.channel.send(exampleEmbed);
            })
        })
    },
};