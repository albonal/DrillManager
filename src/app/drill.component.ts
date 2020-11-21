import { Drill } from './drill';
import { Component, OnInit } from '@angular/core';
import { DrillService } from './drill.service';
@Component({
  selector: 'app-drill',
  templateUrl: './drill.component.html'
})
export class DrillComponent implements OnInit {
  drills: Drill[] = [];
  constructor( private drillService: DrillService) { }

  ngOnInit(): void {
    this.getDrills();
  }

  getDrills() {
    return this.drillService.getDrills().subscribe(drills => {
      this.drills = drills;
    });
  }
}
