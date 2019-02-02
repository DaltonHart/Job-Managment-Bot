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
                let assignedDate = moment(found.assignedDate)
                let inWorks = assignedDate.fromNow()
                let dueDate = moment(found.dueTime).format('MMM Do YYYY')
                let assignedDateFormatted = assignedDate.format('MMM Do YYYY')
                let assignerId = found.assigner.replace(/\D/g, '')
                let assigner = message.client.users.get(assignerId).username
                let complete;
                let completedDate;

                if (found.complete === false) {
                    complete = 'Incomplete'
                } else {
                    complete = 'Complete'
                }
                if (found.completedDate) {
                    completedDate = moment(found.completedDate).format('MMM Do YYYY')
                } else {
                    completedDate = 'Not yet Completed'
                }
                const exampleEmbed = new Discord.RichEmbed()
                    .setColor('#000000')
                    .setTitle(`**TODO:** ${found.description}`)
                    .setDescription(`**Job ID:** ${found._id} assigned to ${found.user} \n **Due:** ${dueDate} **${complete}** \n **Assigned By:** ${assigner} on ${assignedDateFormatted} \n **Completed By:** ${found.completedBy}  **Completed On:** ${completedDate}`)
                    .setTimestamp(new Date())
                    .setFooter(`Assigned ${inWorks}`)

                message.channel.send(`Job Disabled`,exampleEmbed)
        })
    },
};