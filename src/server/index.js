const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const db = require('./mongo');
const Status = require('./led');
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


const Drill = require('./drill.model');



function logSensor(sensorId,sensorData) {
    const originalDrill = {id: sensorId, name: sensorData };
    const drill = new Drill(originalDrill);
    drill.save(error => {
        if (error) return;
       
        console.log('data logged in database');
    });
}

function onClientConnection(sock) {

    sock.on('data',function(data) {
        var reply = "OK ";
        if (data.includes("LOG_TEMPERATURE")) {
            var d = data.toString();
            var temperature = d.substring(d.lastIndexOf(":")+2,d.length);
            logSensor("Temperature", new Date().toDateString() + " " + new Date().toLocaleTimeString() + ": " + temperature + "C");
            reply = reply + "Action:BLINK";
        }

        if (Status.getStatus() == "ON") {
            reply = reply + "Action:ON";
        }

        if (Status.getStatus() == "OFF") {
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
