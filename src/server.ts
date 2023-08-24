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
    app.use(express.static(__dirname + "/src/public/index.html"));
}

function initSocket() {
    
}

function start() {
    server.listen(3000, () => {
        console.log('listening on *:3000');
    });
    
}

main();