import Discord from "discord.js";
import fs from "fs";
import cron from "node-cron";

const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
]});

const prefix = "!";

Client.on("ready", () => {
    console.log("bot on");
});



cron.schedule('30 * * * *', function() {
    console.log('running a task every minute');
    message.channel.send("ca fait 10 sec");
  });




Client.on("messageCreate", message => {
    if(message.author.bot || !message.content.startsWith(prefix)) return;


    if(message.content.startsWith(prefix + "add" )){
        //const name = message.content.slice(prefix.length+3).split(/ +/);
        var name = message.content.substring(5);
        let rawdata = fs.readFileSync('looser.json');
        let loosers = JSON.parse(rawdata);
        //console.log(loosers);
        var looser = loosers.participants.find(player => player.name===name[1]);
        if(!looser){
            let newData = {
                "name": name,
                "lastmatch": "x"
            }  
        
            loosers.participants.push(newData);
            console.log(loosers);
            var newJson = JSON.stringify(loosers);
            fs.writeFile('looser.json', newJson, err => {
                // error checking
                if(err) throw err;
                    
                console.log("New data added");
            });   
        }
        




        message.channel.send("c'est lu")
    }
        console.log()
})

Client.login("OTM1MTk2NzY3NjAxOTUwNzcx.Ye7H3A.bHCyoUtqmcPe9Fd_a0subMcb_ZI");