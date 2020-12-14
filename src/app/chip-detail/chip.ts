export class Chip {
    mac: string;
    description: string;
    location: string;

    constructor(mac:string,
                description: string, 
                location: string) {
        
        this.mac = mac;
        this.description = description;
        this.location = location;
    }
}
 