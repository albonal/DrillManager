const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const db = require('./mongo');
const Status = require('./chip/led');
const root = './';
const port = process.env.Port || 3000;
const app = express();

db.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(root,'dist')));
app.use('/api',routes);
app.get('*', (req,res) => {
    res.sendFile('dist/index.html',{root});
});

app.listen(port , () => console.log(`'api running on localhost: ${port}`));

const net = require('net');
const ip = require('ip');

const tcpServer = net.createServer(onClientConnection);
tcpServer.listen(11000,ip.address(), function() {console.log (`tcp server started ${ip.address()}`);})


const Chip = require('./chip/chip.model');



function saveChip(mac) {
    const chipData = {mac: mac};
    const chip = new Chip(chipData);
    chip.save(error => {
        if (error)   return;
        console.log('data logged in database');
    });
}

function onClientConnection(sock) {

    sock.on('data',function(data) {
        console.log(data.toString());
        var mac = data.toString();
        mac = mac.substring(mac.indexOf("[")+1,mac.indexOf("]"));
        var reply = "OK ";
        if (data.includes("REGISTER_NEW_CHIP")) {
            saveChip(mac);
            reply = reply + "Action:BLINK";
            Status.setStatus(mac,"OFF");
        }

        if (Status.getStatus(mac) == "ON") {
            reply = reply + "Action:ON";
        }

        if (Status.getStatus(mac) == "OFF") {
            reply = reply + "Action:OFF";
        }

        sock.write(reply);
     });

    sock.on('close',function() { 
        console.log(`connection terminated`);
    });

    sock.on('error',function(error) { 
        console.log(`error ${error}`);
    });
};
