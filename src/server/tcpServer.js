const net = require('net');
const ip = require('ip');

exports.startTcpServer = function(port) {
    const server = net.createServer(onClientConnection);
    server.listen(port,ip.address(), function() {console.log (`tcp server started ${ip.address()}`);})
}

function onClientConnection(sock) {

    sock.on('data',function(data) {
        sock.write(`you said ${data}`);
     });

    sock.on('close',function() { 
        sock.write(`connection terminated`);
    });

    sock.on('error',function(error) { 
        sock.write(`error ${error}`);
    });
};





