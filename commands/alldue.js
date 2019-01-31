// !remind
// - Reply via DM to requesting user
// - List all associated "job" descriptions sorted by due dates
// - Do not include "completed" jobs
// - If no jobs associated, give a happy message
// - Autorun this command at 8am daily for users with jobs

const Discord = require('discord.js');
const db = require('../models')
const moment = require('moment')

module.exports = {
    name: 'alldue',
    description: 'Sends a Dm of all Jobs that are not completed.',
    aliases: [],
    usage: '',
    execute(message, args) {
        db.Job.find({
            complete: false
        }).exec((err, jobs) => {

            let filterJobs = jobs.filter(function (job) {
                return job.complete == false
            });

            if (filterJobs.length > 0) {
                function compare(a, b) {
                    const dateA = moment(a.dueTime)
                    const dateB = moment(b.dueTime)
                    let comparison = 0
                    if (dateA > dateB) {
                        comparison = 1;
                    } else if (dateA < dateB) {
                        comparison = -1;
                    }
                    return comparison;
                }
                filterJobs.sort(compare)

                filterJobs.forEach((job) => {
                    let momentToday = moment()
                    let momentJob = moment(found.dueTime)
                    let date = momentJob.format('MMM Do YYYY')

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

                    if (momentToday > momentJob) {
                        const exampleEmbed = new Discord.RichEmbed()
                            .setColor('#C82233')
                            .setTitle(`**TODO:** ${found.description}`)
                            .setDescription(`**Job ID:** ${found._id} assigned to ${found.user} \n **Due:** ${dueDate} **${complete}** \n **Assigned By:** ${assigner} on ${assignedDateFormatted} \n **Completed By:** ${found.completedBy}  **Completed On:** ${completedDate}`)
                            .setTimestamp(new Date())
                            .setFooter(`Assigned ${inWorks}`)

                        message.author.send(exampleEmbed)

                    } else {
                        const exampleEmbed = new Discord.RichEmbed()
                            .setColor('#33CD32')
                            .setTitle(`**TODO:** ${found.description}`)
                            .setDescription(`**Job ID:** ${found._id} assigned to ${found.user} \n **Due:** ${dueDate} **${complete}** \n **Assigned By:** ${assigner} on ${assignedDateFormatted} \n **Completed By:** ${found.completedBy}  **Completed On:** ${completedDate}`)
                            .setTimestamp(new Date())
                            .setFooter(`Assigned ${inWorks}`)

                        message.author.send(exampleEmbed)

                    }
                })

            } else {
                message.author.send(`All jobs are completed. :)`)
            }

            if (message.channel.type === 'dm') return;
            message.reply('I\'ve sent you a DM with all jobs that are not completed.');
        })

    },
};