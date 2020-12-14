import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chip } from '../chip-detail/chip';

const api = '/api';

@Injectable({
  providedIn: 'root'
})
export class ChipService {

  constructor(private http: HttpClient) { }

  turnOnLed(chip: Chip) {
    return this.http.post<Chip>(`${api}/turnOnLed`,chip);
  }

  turnOffLed(chip: Chip) {
    return this.http.post<Chip>(`${api}/turnOffLed`,chip);
  }

  save(chip: Chip) {
    return this.http.post<Chip>(`${api}/turnOffLed`,chip);
  }

  delete(chip: Chip) {
    return this.http.delete<Chip>(`${api}/chip/${chip.mac}`);
  }

  update(chip: Chip) {
    return this.http.put<Chip>(`${api}/chip/${chip.mac}`, chip);
  }

}
