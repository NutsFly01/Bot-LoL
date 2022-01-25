import Discord from "discord.js";
import fs from "fs";
import cron from "node-cron";
import dotenv from "dotenv";
import { getlist, checklastmatch } from "./lolapi.js";
import { ok } from "assert";


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

//tache tout les 1 min (* * * * * * => min heure jour semaine (jour de semaine))

cron.schedule('*/10 * * * * *', async() => {
        //appeler la fonction qui check les loosers

        console.log("check");
        const list1 = getlist();
        list1.then((result) => {   result.forEach(element => {
            //console.log("check de "+ element);
            const loose = checklastmatch(element);
            
            loose.then(result => {  
                
                if(result){

                const channel = Client.channels.cache.find(channel => channel.name === "general");
                channel.send(element + " a perdu sa game de League of Legends");

                }     
            }).catch((error) => {     console.log("Error", error); })
        });  }).catch((error) => {     console.log("Error", error); })


        //console.log(list1);

        

        console.log("fin du check");
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
        




        message.channel.send("c'est ajouté !")
    }
})




Client.login(process.env.BOT_TOKEN);