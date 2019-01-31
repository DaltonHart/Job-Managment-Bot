const Discord = require('discord.js');
const db = require('../models')
const moment = require('moment')

module.exports = {
    name: 'sendme',
    description: 'Shows X number of most recent Jobs Dm to user.',
    args: true,
    usage: '<number of jobs requested>',
    execute(message, args) {
        let userRequested = `<@${message.author.id}>`
        let amount = args[0]
        let finalAmount = parseInt(amount, 10);
        db.Job.find({
            user: userRequested
        }).exec((err, jobs) => {
            if (err) {
                console.log('ERROR', err)
                return message.channel.send(`No user found jobs.`);
            } else {
                if (jobs.length > 0) {
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
                    jobs.sort(compare)
                    let messageLoop = (jobs)=>{
                        for (i = 0; i < finalAmount; i++) {
                            found = jobs[i]

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

                            if (momentToday > momentJob){
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
    
                            
                        }
                    }
                    messageLoop(jobs)
                    
                }
            }

        })
    },

};