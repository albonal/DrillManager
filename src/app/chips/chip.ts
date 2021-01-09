export class Chip {
    mac: string;
    name: string;
    sensorData: string | null;
    switchStatus: string | null;
    activeAt: string| null;
    lastActiveAt: string;
    power: number| null;    

    constructor(mac: string,
        name: string) {

        this.mac = mac;
        this.name = name;
        this.sensorData = null;
        this.switchStatus = null;
        this.activeAt = null;
        this.lastActiveAt="";
        this.power =100;    
    }
}
