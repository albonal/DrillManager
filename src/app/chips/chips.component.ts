import { FormsModule } from '@angular/forms';
import { Chip } from './chip';
import { Component, OnInit, Input } from '@angular/core';
import { ChipsService } from './chips.service';
const connectionTimeout =5000;
const autoRefresh = 2000;

@Component({
  selector: 'app-chip',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.css']
})


export class ChipComponent implements OnInit {
  chips: Chip[] = [];

  // @Input() 
  // selectedChip: Chip = new Chip("","");

  constructor(private chipsService: ChipsService) { }

  ngOnInit(): void {
    this.getChips();
  }

  onChange(ob :any, chip: Chip) {
    if (ob.checked) {
      chip.switchStatus = "ON";
      this.turnOnLed(chip); 
    } else {
      chip.switchStatus = "OFF";
      this.turnOffLed(chip);
    }
  } 

  onSliderChange(ob :any, chip: Chip) {
    this.update(chip);
  } 

  refreshData() {
    this.getChips();
  }


  getChips() {
    return this.chipsService.getChips().subscribe(chips => {
      chips.forEach(chip => {
        if (chip.activeAt != null) {
          chip.connected = Date.now() - chip.activeAt<connectionTimeout;
        } else {
          chip.connected = false;
        }
    
        if (chip.connected == false && chip.switchStatus === "ON") {
          chip.switchStatus = "OFF";
          this.update(chip);
        }
      });
      this.chips = chips;
    });
  }


  turnOnLed(chip: Chip) {
    this.chipsService.turnOnLed(chip).subscribe(chip => {
      setTimeout(() => { this.refreshData()}, autoRefresh);
    });
  }

  turnOffLed(chip: Chip) {
    this.chipsService.turnOffLed(chip).subscribe(chip => {
      setTimeout(() => { this.refreshData()}, autoRefresh);
    });
  }

  delete(chip: Chip) {
    this.chipsService.delete(chip).subscribe(chip => {
      chip.connected = false;
      chip.mac="";
      setTimeout(() => { this.refreshData()}, autoRefresh);
    });
  }

  update(chip: Chip) {
    this.chipsService.update(chip).subscribe(chip => {
    });
  }
}
