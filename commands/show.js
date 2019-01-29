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
                let assignedDate = moment(found.assignedDate)

                let dueDate = moment(found.dueTime).format('MMM Do YY')
                let assignedDateFormatted = assignedDate.format('MMM Do YY')
                let assignerId = found.assigner.replace(/\D/g,'')
                let assigner = message.client.users.get(assignerId).username

                    const exampleEmbed = new Discord.RichEmbed()
                        .setColor('#724B34')
                        .setTitle(`**TODO:** ${found.description}`)
                        .setDescription(`**Job ID:** ${found._id} assigned to ${found.user} \n **Complete:** ${found.complete}   **Due:** ${dueDate} \n **Assigned By:** ${assigner} on ${assignedDateFormatted}`)
                        .setTimestamp(new Date())
  
                message.channel.send(exampleEmbed);
              }
              
        })
    },
    
};