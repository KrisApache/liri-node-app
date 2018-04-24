require("dotenv").config();

var keys = require("./keys.js");

var fs = require("fs");

var dateTime = require('node-datetime');
var dt = dateTime.create();

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

function writeLog(logtext) {

    fs.appendFileSync("./log.txt", "\n"+logtext, function (err) {

        if (err) {
            return console.log(err);
        }
    });
}

function userTweets() {
    writeLog("-----------------------------------------------------------");
    writeLog(new Date(dt.now()));
    writeLog("Command: my-tweets");
    writeLog("-----------------------------------------------------------");
    var params = { screen_name: 'AgentAlden' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 20; i++) {
                console.log("tweet " + (i + 1) + " : " + JSON.stringify(tweets[i].text));
                writeLog("tweet " + (i + 1) + " : " + JSON.stringify(tweets[i].text));
            }
        }
    });
}

function userSpotifySong(song) {
    writeLog("-----------------------------------------------------------");
    writeLog(new Date(dt.now()));
    writeLog("Command: spotify-this-song "+song);
    writeLog("-----------------------------------------------------------");

    var songQuery = "";

    if (song == '') { songQuery = "The Sign" }
    else { songQuery = song };

    spotify.search({ type: 'track', query: songQuery }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Link: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);

        writeLog("Artist(s): " + data.tracks.items[0].artists[0].name);
        writeLog("Song Name: " + data.tracks.items[0].name);
        writeLog("Link: " + data.tracks.items[0].external_urls.spotify);
        writeLog("Album: " + data.tracks.items[0].album.name);

    });

}

function infoOMDB(movie) {

    writeLog("-----------------------------------------------------------");
    writeLog(new Date(dt.now()));
    writeLog("Command: movie-this "+movie);
    writeLog("-----------------------------------------------------------");

    var movieQuery = "";

    if (movie == '') { movieQuery = "Mr. Nobody" }
    else { movieQuery = movie };

    request("http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        if (!error && response.statusCode === 200) {

            console.log("Title: " + JSON.parse(body).Title);
            console.log("Released: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);

            writeLog("Title: " + JSON.parse(body).Title);
            writeLog("Released: " + JSON.parse(body).Year);
            writeLog("IMDB Rating: " + JSON.parse(body).imdbRating);
            writeLog("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            writeLog("Country: " + JSON.parse(body).Country);
            writeLog("Language: " + JSON.parse(body).Language);
            writeLog("Plot: " + JSON.parse(body).Plot);
            writeLog("Actors: " + JSON.parse(body).Actors);

        }
    });

}


function readRandomFile() {

    writeLog("===========================================================");
    writeLog(new Date(dt.now()));
    writeLog("Command: do-what-it-says ");

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        // console.log(data);

        var dataArr = data.split(",");

        // console.log(dataArr);
        executeCommand(dataArr[0], dataArr[1]);

    });
}

function executeCommand(comm, par) {

    var comm = comm;
    var par = par;

    switch (comm) {
        case 'my-tweets':
            // console.log("Twitter");
            userTweets();
            // console.log(par);
            break;

        case 'spotify-this-song':
            // console.log("Spotify");
            userSpotifySong(par);
            break;

        case 'movie-this':
            // console.log("OMDB");
            infoOMDB(par);
            break;

        case 'do-what-it-says':
            // console.log("Do Something");
            readRandomFile();
            break;

        default: console.log("Cannot recognize command. Please enter a valid command.");

            break;
    }

}

var command = process.argv[2];
var param = process.argv.slice(3, process.argv.length);

executeCommand(command, param);

