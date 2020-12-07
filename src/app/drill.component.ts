import { FormsModule } from '@angular/forms';
import { Drill } from './drill';
import { Component, OnInit } from '@angular/core';
import { DrillService } from './drill.service';

@Component({
  selector: 'app-drill',
  templateUrl: './drill.component.html'
})

export class DrillComponent implements OnInit {
  drills: Drill[] = [];
  newDrill : Drill = new Drill("0","") ;
  constructor( private drillService: DrillService) { }

  ngOnInit(): void {
    this.getDrills();
  }

  getDrills() {
    return this.drillService.getDrills().subscribe(drills => {
      this.drills = drills;
    });
  }

  save() {
    this.drillService.addDrill(this.newDrill).subscribe(drill=> {
      this.drills.push(drill);
    });
  }

  turnOnLed() {
    this.drillService.turnOnLed(this.newDrill).subscribe(drill=> {
      this.drills.push(drill);
    });
  }

  turnOffLed() {
    this.drillService.turnOffLed(this.newDrill).subscribe(drill=> {
      this.drills.push(drill);
    });
  }
}
