import fetch from "node-fetch";
import fs from "fs";

var name1 = "Zboubozaure";
var api_key1="RGAPI-4826b4ba-c319-44bd-af23-e0c07ac8b6d2"

async function ajoutUser(name, last) {
    let rawdata = fs.readFileSync('looser.json');
    let loosers = JSON.parse(rawdata);
    console.log(loosers);
    var looser = loosers.participants.find(player => player.name===name);
    if(looser){
        if(last!=looser.lastmatch){
            looser.lastmatch = last;
            var newJson = JSON.stringify(loosers);
            fs.writeFile('looser.json', newJson, err => {
            // error checking
            if(err) throw err;
            
            console.log("data modified");
        });   

        }
    }else{

        let newData = {
            "name": name,
            "lastmatch": last
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
}


async function readMatch(name){
    let rawdata = fs.readFileSync('looser.json');
    let loosers = JSON.parse(rawdata);
    console.log(loosers);
    var looser = loosers.participants.find(player => player.name===name);
    if(looser!=undefined){
        return looser;
    }

}

async function getPuuid(name,api_key) {

    const reponse = await fetch("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+name+"?api_key="+api_key)
    const account = await reponse.json();
    const reslmatch = await fetch("https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/"+account.puuid+"/ids?type=ranked&start=3&count=4&api_key="+api_key)
    const lastMatch = await reslmatch.json();
    
    const test = readMatch("Kinemon");
    //ajoutUser("Kinemon","a");
    //console.log(test.participants);
    if(lastMatch[0]!=stockmatch){
    const resmatch = await fetch("https://europe.api.riotgames.com/lol/match/v5/matches/"+lastMatch[0]+"?api_key="+api_key)
    const match = await resmatch.json();
        return match;
    
    }
    //else{
    //    return ggwin;
    //}
    
    }

const pd = await getPuuid(name1,api_key1);

var player = pd.info.participants.find(player => player.summonerName==="Zboubozaure");

//console.log(player.win);

