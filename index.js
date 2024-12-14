import Discord from "discord.js";
import fs from "fs";
import cron from "node-cron";
import dotenv from "dotenv";
import { getlist, checklastmatch, findlastmatch } from "./lolapi.js";

//ca fait quoi si je fais ca ? 
//test de git je comprend rien     

dotenv.config();

const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});

const prefix = "!";

Client.on("ready", () => {
    console.log("bot on");
    //const channel = Client.channels.cache.find(channel => channel.name === "general");
    //channel.send("Je suis la, bande de merde");

});

//tache tout les 1 min (* * * * * * => min heure jour semaine (jour de semaine))

cron.schedule('*/10 * * * * *', async () => {
    //appeler la fonction qui check les loosers

    console.log("check");
    const list1 = getlist();
    list1.then((result) => {
        result.forEach(element => {
            //console.log("check de " + element);
            const lastmatch = findlastmatch(element);

            lastmatch.then(matchjson => {
                const loose = checklastmatch(element);
                loose.then(result => {

                    if (result) {
                        if (matchjson != "x") {
                            const channel = Client.channels.cache.find(channel => channel.name === "general");
                            channel.send(element + " a perdu sa game de League of Legends");
                        } else {
                            console.log("c'est un x le dernier match");
                        }

                    } else {
                        //console.log(element + " a gagner la game");
                    }
                }).catch((error) => { console.log("Error", error); })

            }).catch((error) => { console.log("Error", error); })

        });
    }).catch((error) => { console.log("Error", error); })

});





Client.on("messageCreate", message => {
    console.log("message");
    if (message.author.bot || !message.content.startsWith(prefix)) return;


    if (message.content.startsWith(prefix + "add")) {
        //const name = message.content.slice(prefix.length+3).split(/ +/);
        var name = message.content.substring(5);
        let rawdata = fs.readFileSync('looser.json');
        let loosers = JSON.parse(rawdata);
        //console.log(loosers);
        var looser = loosers.participants.find(player => player.name === name);
        if (!looser) {
            let newData = {
                "name": name,
                "lastmatch": "x"
            }

            loosers.participants.push(newData);
            console.log(loosers);
            var newJson = JSON.stringify(loosers);
            fs.writeFile('looser.json', newJson, err => {
                // error checking
                if (err) throw err;

                console.log("New data added");
            });
            message.react("👍");
        } else {
            message.channel.send("il est déjà tracké");
        }


    }

    if (message.content.startsWith(prefix + "del")) {

        var name = message.content.substring(5);
        let rawdata = fs.readFileSync('looser.json');
        let loosers = JSON.parse(rawdata);
        console.log(loosers);
        var looser = loosers.participants.findIndex(player => player.name === name);
        console.log("tu dois supprimer le "+ looser+ "eme");
        if (looser>=0) {
            
            loosers.participants.splice(looser, 1);
            //ecrire delete la personne tracké
            console.log("il est plus la : ");
            console.log(loosers);
            //delete looser; 
            
            var newJson = JSON.stringify(loosers);

            fs.writeFile('looser.json', newJson, err => {
                // error checking
                if (err) throw err;

                console.log("New data added");
            });

            message.react("👍");
        } else {
            message.channel.send("Il n'est pas dans la liste !");
        }


    }

    if (message.content.startsWith(prefix + "list")) {
        var str = '';
        const list1 = getlist();
        

        list1.then((result) => {
            result.forEach(element => {
                str= str + element + "\n";
            });
            console.log(str);

            const exampleEmbed = {
                title: 'League Of Looser',
                color: '#8B0000',
                fields: [
                    {
                        name: 'Liste: ',
                        value: str,
                    }
                ]
            }

            message.channel.send({ embeds: [exampleEmbed] });
            
        }).catch((error) => { console.log("Error", error); })

        
        
    }


})

Client.login(process.env.BOT_TOKEN);
