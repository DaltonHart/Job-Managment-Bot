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
        databaseCall = () => {

            db.Job.findOneAndUpdate({
                _id: id
            }, updatedJob, {
                new: true
            }, (err, found) => {
                if (err) {
                    console.log('ERROR', err)
                    return message.channel.send(`Invalid id entered.`);
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
                    completedDate = 'Not yet Completed'
                } else {
                    complete = 'Complete'
                    completedDate = moment(found.completedOn).format('MMM Do YYYY')
                }

                const exampleEmbed = new Discord.RichEmbed()
                    .setColor('#724B34')
                    .setTitle(`**TODO:** ${found.description}`)
                    .setDescription(`**Job ID:** ${found._id} assigned to ${found.user} \n **Due:** ${dueDate} **${complete}** \n **Assigned By:** ${assigner} on ${assignedDateFormatted} \n **Completed By:** ${found.completedBy}  **Completed On:** ${completedDate}`)
                    .setTimestamp(new Date())
                    .setFooter(`Assigned ${inWorks}`)

                message.channel.send(`Job ${found._id} has been marked as not complete.`, exampleEmbed);
            })
        }

        message.client.channels.get("493242085831475210").fetchMessages({ limit: 30 })
            .then(messages => {
                messages.forEach(channelMessage => {
                    console.log(channelMessage)
                    if (channelMessage.content.includes(`${args[0]}`)) {
                        message.channel.fetchMessage(channelMessage.id)
                            .then(msg => msg.delete())
                            .catch(console.error);
                    }
                    if (channelMessage.embeds === undefined || channelMessage.embeds.length == 0) {
                        console.log('no embeds')
                    } else {
                        if (channelMessage.embeds[0].description.includes(`**Job ID:** ${args[0]}`)) {
                            message.channel.fetchMessage(channelMessage.id)
                                .then(msg => msg.delete())
                                .catch(console.error);
                        }
                    }
                })
                databaseCall()
            })
            .catch(console.error);
    },
};