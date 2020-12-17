import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chip } from './chip';

const api = '/api';

@Injectable({
  providedIn: 'root'
})
export class ChipsService {

  constructor(private http: HttpClient) { }

  getChips() {
    return this.http.get<Array<Chip>>(`${api}/chips`);
  }

  getChip(chip: Chip) {
    return this.http.get<Chip>(`${api}/chip/${chip.mac}`);
  }

  turnOnLed(chip: Chip) {
    return this.http.post<Chip>(`${api}/turnOnLed`, chip);
  }

  turnOffLed(chip: Chip) {
    return this.http.post<Chip>(`${api}/turnOffLed`, chip);
  }

  delete(chip: Chip) {
    return this.http.delete<Chip>(`${api}/chip/${chip.mac}`);
  }

  update(chip: Chip) {
    return this.http.put<Chip>(`${api}/chip/${chip.mac}`, chip);
  }
}
