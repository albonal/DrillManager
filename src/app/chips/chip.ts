export class Chip {
    mac: string;
    description: string;
    location: string;
    sensorData: string | null;
    switchStatus: string | null;

    constructor(mac: string,
        description: string,
        location: string) {

        this.mac = mac;
        this.description = description;
        this.location = location;
        this.sensorData = null;
        this.switchStatus = null;
    }
}
