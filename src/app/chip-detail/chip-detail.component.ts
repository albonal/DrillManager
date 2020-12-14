import { ChipService } from './chip.service';
import { Chip } from './chip';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chip-detail',
  templateUrl: './chip-detail.component.html',
  styleUrls: ['./chip-detail.component.css']
})
export class ChipDetailComponent implements OnInit {

  @Input() chip: Chip = new Chip("","","");

  constructor( private chipService: ChipService) { }


  ngOnInit(): void {
  }

  turnOnLed() {
    this.chipService.turnOnLed(this.chip).subscribe(chip=> {
    });
  }

  turnOffLed() {
    this.chipService.turnOffLed(this.chip).subscribe(chip=> {
    });
  }

  delete() {
    this.chipService.delete(this.chip).subscribe(chip=> {
    });
    this.chip.mac="";
  }

  update() {
    this.chipService.update(this.chip).subscribe(chip=> {
    });
  }

}
