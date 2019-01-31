//!show5

//!show JobID to just summon that text block

//!transfer "jobID" @newusername

// !done job#
// - Change "complete" boolean of job to true
const Discord = require('discord.js');
const db = require('../models')
const moment = require('moment')

module.exports = {
    name: 'sendme',
    description: 'Shows X number of most recent Jobs Dm to user.',
    args: true,
    usage: '<number of jobs requested>',
    execute(message, args) {
        console.log('sendme activated')
        let userRequested = `<@${message.author.id}>`
        let amount = args[0]
        let finalAmount = parseInt(amount, 10);
        db.Job.find({
            user: userRequested
        }).exec((err, jobs) => {
            console.log('jobs found in db',jobs)
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
                    console.log('jobs sorted', jobs)
                    let messageLoop = (jobs)=>{
                        console.log('loop func activated')
                        console.log(finalAmount)
                        for (i = 0; i <= finalAmount; i++) {
                            found = jobs[i]
                            console.log('found',found)
    
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
                                .setColor('#724B34')
                                .setTitle(`**TODO:** ${found.description}`)
                                .setDescription(`**Job ID:** ${found._id} assigned to ${found.user} \n **${complete}**   **Due:** ${dueDate} \n **Assigned By:** ${assigner} on ${assignedDateFormatted} \n **Completed By:** ${found.completedBy}  **Completed On:** ${completedDate}`)
                                .setTimestamp(new Date())
                                .setFooter(`Assigned ${inWorks}`)
    
                                message.author.send(exampleEmbed)
                        }
                    }
                    messageLoop(jobs)
                    
                }
            }

        })
    },

};