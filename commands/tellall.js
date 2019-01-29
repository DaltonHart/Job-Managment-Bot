// !tellall
// - Reply via DM to requesting user
// - List all job descriptions, sorted by due date
// - Print all incomplete jobs in bold

const Discord = require('discord.js');
const db = require('../models')
const moment = require('moment')

module.exports = {
    name: 'tellall',
    description: 'Sends a Dm of all Jobs sorted by due date.',
    aliases: [],
    usage: '',
    execute(message, args) {
        let userRequested = `<@${message.author.id}>`
        db.Job.find({user:userRequested}).exec((err,jobs)=>{

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

            jobs.forEach((job)=>{
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
                    message.author.send(`Assigned: ${job.user}`,{embed})
                } else {
                    let embed = new Discord.RichEmbed()
                        .setTimestamp(new Date())
                        .setColor('#33CD32')
                        .setTitle(`Job Due`)
                        .setDescription(`Job ID: ${job._id}`)
                        .addField(`TODO:`,`${job.description}`, false)
                        .addField(`COMPLETE:`, `${job.complete}`, true)
                        .addField(`DUE:`,`${date}`, true)
                    message.author.send(`Assigned: ${job.user}`,{embed})
                }
            })
            if (message.channel.type === 'dm') return; 
                message.reply('I\'ve sent you a DM with your jobs!');
            })
    },
};