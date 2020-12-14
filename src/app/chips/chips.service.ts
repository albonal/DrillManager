
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chip } from '../chip-detail/chip';

const api = '/api';

@Injectable({
  providedIn: 'root'
})
export class ChipsService {

  constructor(private http: HttpClient) { }

  getChips() {
    return this.http.get<Array<Chip>>(`${api}/chips`);
  }

  addChip(chip: Chip) {
    return this.http.post<Chip>(`${api}/chip`,chip);
  }

  


}
