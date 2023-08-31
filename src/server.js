const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

function main() {
    initHttp();
    initSocket();
    start();
}

function initHttp() {
    app.use(express.static(__dirname + "/public"));
    
    app.get("/", (req, res) => {
        console.log("test");
        res.status(200).sendFile(__dirname + "/public/index.html");
    });
}

function initSocket() {
    
}

function start() {
    server.listen(9603, () => {
        console.log('listening on *:9603');
    });

}

main();