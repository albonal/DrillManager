var statusDic = new Object();

function setStatus(mac,s) {
    statusDic[mac] = s;
}

function getStatus(mac) {
    return statusDic[mac];
}

module.exports = {setStatus,getStatus};