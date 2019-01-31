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
    description: 'A command to to show all disabled jobs.',
    args: false,
    usage: '',
    execute(message, args) {

        db.Job.find({
            disabled: true
        }).exec((err, jobs) => {
            if (err) {
                console.log('ERROR', err)
            }
            jobs.forEach((found) => {

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

                message.channel.send(exampleEmbed)

            })
        })
    },
};