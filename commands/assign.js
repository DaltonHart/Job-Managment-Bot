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
        let createdDueDate = commandParts[3]

        let dateArr = createdDueDate.split(' ')
        var filtered = dateArr.filter(function (el) {
            return el != '';
          });
        if (filtered.length <= 2){
            let year = new Date()
            filtered.push(year.toISOString().split('-')[0])
            let finalDate = filtered.join(' ')
            createdDueDate = finalDate
        }
        
        let id;

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
                  let dueDate = moment(newJob.dueTime).format('MMM Do YY')
                  let assignedDate = moment(newJob.assignedDate)
                  let inWorks = assignedDate.fromNow()
                  let assignedDateFormatted = assignedDate.format('MMM Do YY')
                  
                  
                  
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
                        .setDescription(`**Job ID:** ${newJob._id} assigned to ${newJob.user} \n **Complete:** ${newJob.complete}   **Due:** ${dueDate} \n **Assigned By:** ${assigner} on ${assignedDateFormatted} \n **Completed By:** ${newJob.completedBy} **${complete}**`)
                        .setFooter(`Assigned ${inWorks}`)
                        .setTimestamp(new Date())
      
                message.channel.send(exampleEmbed);
                message.channel.send(`${newJob.user} currently has **${overburden} jobs** assigned.`);
                  })
                  
            })
        })

        
    },
    
};