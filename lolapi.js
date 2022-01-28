import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

var api_key = process.env.API_LOL_TOKEN;

async function ajoutUser(name, last) {
    let rawdata = fs.readFileSync('looser.json');
    let loosers = JSON.parse(rawdata);
    //console.log(loosers);
    var looser = loosers.participants.find(player => player.name === name);
    if (looser) {
        if (last != looser.lastmatch) {
            looser.lastmatch = last;
            var newJson = JSON.stringify(loosers);
            console.log(loosers);
            fs.writeFile('looser.json', newJson, err => {
                // error checking
                if (err) throw err;
                console.log("data modified");
            });
        }
    } else {
        let newData = {
            "name": name,
            "lastmatch": last
        }

        loosers.participants.push(newData);
        console.log(loosers);
        var newJson = JSON.stringify(loosers);
        fs.writeFile('looser.json', newJson, err => {
            // error checking
            if (err) throw err;
            console.log("New data added");
        });
    }
}


async function readMatch(name) {
    let rawdata = fs.readFileSync('looser.json');
    let loosers = JSON.parse(rawdata);
    //console.log(loosers);
    var looser = loosers.participants.find(player => player.name === name);
    if (looser != undefined) {
        return looser.lastmatch;
    }
}

export async function checklastmatch(name) {

    const reponse = await fetch("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + api_key);
    if (reponse.status == 200) {
        const account = await reponse.json();

        const reslmatch = await fetch("https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + account.puuid + "/ids?type=ranked&start=0&count=1&api_key=" + api_key);
        const lastMatch = await reslmatch.json();

        const test = await readMatch(name);
        //console.log("on est la " +test+ " "+ lastMatch[0]);
        
        if (lastMatch[0] != test){
            //console.log("ca check ici");
            const resmatch = await fetch("https://europe.api.riotgames.com/lol/match/v5/matches/" + lastMatch[0] + "?api_key=" + api_key)
            const match = await resmatch.json();
            ajoutUser(name, lastMatch[0]);
            var player = match.info.participants.find(player => player.summonerName === name);
            console.log("gagne ? "+ name +" "+ player.win);
            
            return !player.win;

        } else {

            return false;
        }
    }

    return false;
}

export async function getlist() {
    let rawdata = fs.readFileSync('looser.json');
    let loosers = JSON.parse(rawdata);
    let array1 = [];
    //console.log("recuperation de liste");
    loosers.participants.forEach(element => {
        array1.push(element.name);
    });
    return array1;
}

export async function findlastmatch(name) {
    let rawdata = fs.readFileSync('looser.json');
    let loosers = JSON.parse(rawdata);
    
    var player = loosers.participants.find(player => player.name === name);

    return player.lastmatch;
}



