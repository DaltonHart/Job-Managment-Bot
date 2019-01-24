const    
    Discord = require("discord.js"),
    { prefix, token, } = require('./config.json'),
    fs = require('fs'),
    cooldowns = new Discord.Collection(),
    express = require('express'),
    app = express(),
    db = require('./models');

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
  if(message.member.roles.some(r=>["devs", "Proficient"].includes(r.name)) ) {
    // has one of the roles
  
  
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  //allows use of alias 
  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

//checking if user actually left any arguments
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
      return message.channel.send(reply);
  }
// // adding cooldown for command usage
// //check if comand has cooldown if not add it dynamically
//   if (!cooldowns.has(command.name)) {
//     cooldowns.set(command.name, new Discord.Collection());
//   }
// // variables around cooldown
//   const now = Date.now();
//   const timestamps = cooldowns.get(command.name);
//   const cooldownAmount = (command.cooldown || 15) * 1000;
// // checks if user is on cooldown then either removes it or display cooldown timer
//   if (!timestamps.has(message.author.id)) {
//     timestamps.set(message.author.id, now);
//     setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
//   }
//   else {
//     const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
//     // tell user to wait
//     if (now < expirationTime) {
//         const timeLeft = (expirationTime - now) / 1000;
//         return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
//     }

//     timestamps.set(message.author.id, now);
//     setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
//   }

  // testing for error in command
  try {
    command.execute(message, args);
  }
  catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
  }
  } else {
    message.channel.send(`You do not have the correct role to use me. Sorry!`)
  }
  
});

client.login(token);

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