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
    name: 'assign',
    description: 'A command to set a job to a taged user.',
    args: true,
    usage: '"<description>" <user> "<due date>"',
    execute(message, args) {
        let commandParts = message.content.split('"')
        let assignedUser = commandParts[2].replace(/\s/g, '');
        let desc = commandParts[1]
        let dueDate = commandParts[3]

        let dateArr = dueDate.split(' ')
        var filtered = dateArr.filter(function (el) {
            return el != '';
          });
        if (filtered.length <= 2){
            let year = new Date()
            filtered.push(year.toISOString().split('-')[0])
            let finalDate = filtered.join(' ')
            dueDate = finalDate
        }
        
        let id;

        db.Job.find().exec((err,jobs)=>{
            let total = jobs.length
            if (total === 0){
                id = 1
            } else {
                id = jobs[total-1]._id + 1
            }
            
            let job = {
                user: assignedUser,
                description: desc,
                complete: false,
                dueTime: dueDate,
                _id: id
            }
    
            db.Job.create(job, (err, newJob)=>{
                if (err) {
                    console.log('ERROR', err)
                  }
                  let date = moment(newJob.dueTime).format('MMM Do YY')
                  const exampleEmbed = new Discord.RichEmbed()
                  .setTimestamp(new Date())
                  .setColor('#724B34')
                  .setTitle(`Job Assigned`)
                  .setDescription(`Job ID: ${newJob._id}`)
                  .addField(`TODO:`,`${newJob.description}`, false)
                  .addField(`COMPLETE:`, `${newJob.complete}`, true)
                  .addField(`DUE:`,`${date}`, true)
                  .setFooter(`Assigned by ${message.author.username}`)
      
              message.channel.send(`${newJob.user}has been assigned a job.`,exampleEmbed);
            })
        })

        
    },
    
};