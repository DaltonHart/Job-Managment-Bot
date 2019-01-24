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
  if(message.type == 'dm' || message.member.roles.some(r=>["devs", "admin"].includes(r.name)) ) {
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