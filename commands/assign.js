// !assign
// - Create a "job" class and ID
// - Associate a "description" string
// - Associate "job" to an @user
// - Associate a due time to the "job"
// - Associate boolean "complete" to false
// !assign [description] [user] [due time] edit* wants days to return as number to add to current date with default of 3 if none given

const Discord = require('discord.js');
const db = require('../models')
const moment = require('moment')

module.exports = {
    name: 'assign',
    description: 'A command to set a job to a taged user.',
    args: true,
    usage: '"<description>" <user> "<number of days till due>"',
    execute(message, args) {
        let commandParts = message.content.split('"')
        let assignedUser = commandParts[2].replace(/\s/g, '');
        let desc = commandParts[1]
        let createdDueDate;
        let today = new Date()

        function addDays(startDate,numberOfDays){
                let returnDate = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate()+numberOfDays,
                startDate.getHours(),
                startDate.getMinutes(),
                startDate.getSeconds());
                return returnDate;
                }

        if (commandParts[3]){
            let text = commandParts[3];
            let finalNumber = parseInt(text, 10);
            createdDueDate = addDays(today, finalNumber)
        } else {
            createdDueDate = addDays(today, 3)
        }
        
        db.Job.find().exec((err,jobs)=>{
            function findMinMax(arr) {
                let min = arr[0]._id, max = arr[0]._id;
              
                for (let i = 1, len=arr.length; i < len; i++) {
                  let v = arr[i]._id;
                  min = (v < min) ? v : min;
                  max = (v > max) ? v : max;
                }
              
                return [min, max];
              }
              
              let max = findMinMax(jobs)
              let id = max[1] + 1
            
            let assigner = `<@${message.author.id}>`

            let job = {
                user: assignedUser,
                description: desc,
                complete: false,
                dueTime: createdDueDate,
                assigner: assigner,
                assignedDate: new Date(),
                _id: id,
                completedBy: 'NA',
            }

            db.Job.create(job, (err, newJob)=>{
                if (err) {
                    console.log('ERROR', err)
                  }
                  let dueDate = moment(newJob.dueTime).format('MMM Do YYYY')
                  let assignedDate = moment(newJob.assignedDate)
                  let inWorks = assignedDate.fromNow()
                  let assignedDateFormatted = assignedDate.format('MMM Do YYYY')
                  
                  db.Job.find({user:assignedUser}).exec((err,jobs)=>{
                      let overburden = jobs.length
                      let assignerId = newJob.assigner.replace(/\D/g,'')
                      let assigner = message.client.users.get(assignerId).username
                      let complete;

                      if (newJob.complete === false){
                          complete = 'Incomplete'
                      } else {
                          complete = 'Complete'
                      }

                    const exampleEmbed = new Discord.RichEmbed()
                        .setColor('#724B34')
                        .setTitle(`**TODO:** ${newJob.description}`)
                        .setDescription(`**Job ID:** ${newJob._id} assigned to ${newJob.user} \n **Due:** ${dueDate} **${complete}** \n **Assigned By:** ${assigner} on ${assignedDateFormatted}`)
                        .setFooter(`Assigned ${inWorks}`)
                        .setTimestamp(new Date())
      
                message.channel.send(exampleEmbed);
                message.channel.send(`${newJob.user} currently has **${overburden} jobs** assigned.`);
                  })
            })
        })

        
    },
    
};