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
       
        console.log('drill created');
    });
}

var  x=0;

function onClientConnection(sock) {

    sock.on('data',function(data) {

        if (data.includes("BUTTON_PRESSED")) {
            x=x+1;
            logSensor("TempSensor", new Date().toISOString() + ":" + data);
            if (x%2 == 0) {
                data = data + ".Action:BLINK";
            }
        }

        if (Status.getStatus() == "ON") {
            data = data + ".Action:ON";
        }

        if (Status.getStatus() == "OFF") {
            data = data + ".Action:OFF";
        }

        sock.write(`OK: Logged: ${data}.`);
     });

    sock.on('close',function() { 
        console.log(`connection terminated`);
    });

    sock.on('error',function(error) { 
        console.log(`error ${error}`);
    });
};
