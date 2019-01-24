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
    cooldown: 5,
    execute(message, args) {
        db.Job.find({complete:false}).exec((err,jobs)=>{

            let filterJobs = jobs.filter(function (job) {
                return job.complete == false 
              });
            
            if(filterJobs.length > 0){
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

            filterJobs.forEach((job)=>{
                let momentToday = moment()
                let momentJobDate = moment(job.dueTime)
                let date = momentJobDate.format('MMM Do YY')

                if (momentToday > momentJobDate){
                    let embed = new Discord.RichEmbed()
                        .setTimestamp(new Date())
                        .setColor('#C82233')
                        .setTitle(`Job Due`)
                        .setDescription(`Job ID: ${job._id}`)
                        .addField(`TODO:`,`${job.description}`, false)
                        .addField(`COMPLETE:`, `${job.complete}`, true)
                        .addField(`DUE:`,`${date}`, true)
                    message.author.send({embed})
                } else {
                    let embed = new Discord.RichEmbed()
                        .setTimestamp(new Date())
                        .setColor('#33CD32')
                        .setTitle(`Job Due`)
                        .setDescription(`Job ID: ${job._id}`)
                        .addField(`TODO:`,`${job.description}`, false)
                        .addField(`COMPLETE:`, `${job.complete}`, true)
                        .addField(`DUE:`,`${date}`, true)
                    message.author.send({embed})
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