export class Chip {
    mac: string;
    name: string;
    sensorData: string | null;
    switchStatus: string | null;
    activeAt: number;
    power: number| null;
    connected: boolean|null;

    constructor(mac: string,
        name: string) {

        this.mac = mac;
        this.name = name;
        this.sensorData = null;
        this.switchStatus = null;
        this.activeAt=0;
        this.power =100;
        this.connected = false;
    }
}
