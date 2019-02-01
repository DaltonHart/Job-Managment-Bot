const    
    Discord = require("discord.js"),
    { prefix, } = require('./config.json'),
    fs = require('fs'),
    cooldowns = new Discord.Collection(),
    express = require('express'),
    app = express(),
    db = require('./models'),
    moment = require('moment'),
    cron = require('node-cron');

    require('dotenv').config();

    require('heroku-self-ping')(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com`);

app.use('/files', express.static('files'));

const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//console log running
client.on("ready", () => {
  client.user.setActivity('!commands');
  console.log("Commands Ready!");
});


client.on("message", (message) => {
  if(message.channel.type === 'dm' || message.member.roles.some(r=>["devs", "admin", "helpers"].includes(r.name))) {
    
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
      return message.channel.send(reply);
  }

  // testing for error in command
  try {
    command.execute(message, args);
  }
  catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
  }
  } 
  
});

client.login(process.env.TOKEN);

app.listen(process.env.PORT || 8000, ()=>{
  console.log('Listening to port');
  })

app.get('/', (req, res) => {
  res.json({data: 'running'});
  })

app.get('/api/jobs', (req,res)=>{
  db.Job.find()
  .exec((err, jobs) => {
    let total = jobs.length
    if (err) {
      return console.log("index error: " + err); }
      res.json({
        amount: total,
        data:jobs
      });
    })
})

cron.schedule('0 0 8 * *', () => {
  console.log('cron activate and jobs sent');
  db.Job.find({complete:false}).exec((jobs)=>{
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
      let jobUser = job.user
      let userId = jobUser.replace(/\D/g,'')
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
              Client.users.get(userId).send(`Assigned: ${job.user}`,{embed})
      } else {
          let embed = new Discord.RichEmbed()
              .setTimestamp(new Date())
              .setColor('#33CD32')
              .setTitle(`Job Due`)
              .setDescription(`Job ID: ${job._id}`)
              .addField(`TODO:`,`${job.description}`, false)
              .addField(`COMPLETE:`, `${job.complete}`, true)
              .addField(`DUE:`,`${date}`, true)
              Client.users.get(userId).send(`Assigned: ${job.user}`,{embed})
      }
  })
  } else {
    Client.users.get(userId).send(`All jobs are completed. :)`)
  }
  })
});


