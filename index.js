import Discord from "discord.js";
import fs from "fs";
import cron from "node-cron";
import dotenv from "dotenv";


dotenv.config();

const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
]});

const prefix = "!";

Client.on("ready", () => {
    console.log("bot on");
});

cron.schedule('* */5 * * * *', () => {
        //appeler la fonction qui check les loosers


        const channel = Client.channels.cache.find(channel => channel.name === "general");
        channel.send("message qui doit dire la defaite du mec");

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




Client.login(process.env.BOT_TOKEN);