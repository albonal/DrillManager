
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drill } from './drill';

const api = '/api';

@Injectable({
  providedIn: 'root'
})
export class DrillService {

  constructor(private http: HttpClient) { }

  getDrills() {
    return this.http.get<Array<Drill>>(`${api}/drills`);
  }

  addDrill(drill: Drill) {
    return this.http.post<Drill>(`${api}/drill`,drill);
  }
}
