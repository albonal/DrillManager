import { FormsModule } from '@angular/forms';
import { Chip } from './chip';
import { Component, OnInit, Input } from '@angular/core';
import { ChipsService } from './chips.service';

@Component({
  selector: 'app-chip',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.css']
})

export class ChipComponent implements OnInit {
  chips: Chip[] = [];

  @Input() 
  selectedChip: Chip = new Chip("","");

  constructor(private chipsService: ChipsService) { }

  ngOnInit(): void {
    this.getChips();
  }

  onChange(ob :any, chip: Chip) {
    if (ob.checked) {
      this.selectedChip = chip;
      this.turnOnLed(); 
    } else {
      this.selectedChip = chip;
      this.turnOffLed();
    }
  } 

  onSliderChange(ob :any, chip: Chip) {
    this.selectedChip = chip;
    this.update();
  } 


  onSelect(chip: Chip) {
    this.selectedChip = chip;
  }

  refreshData() {
    this.getChips();
    this.getChip();
  }

  setLastActiveTime(element: Chip) {
    if (element.activeAt != null) {
      var eventStartTime = new Date(element.activeAt);
      var eventEndTime = new Date();
      element.lastActiveAt = Math.round(((eventEndTime.valueOf() - eventStartTime.valueOf())/1000)).toString();
    }
    return element;
  }

  getChips() {
    return this.chipsService.getChips().subscribe(chips => {
      chips.forEach(element => {
        element = this.setLastActiveTime(element);
      });
      this.chips = chips;
    });
  }

  getChip() {
    return this.chipsService.getChip(this.selectedChip).subscribe(chip => {
      this.selectedChip = this.setLastActiveTime(chip);;
    });
  }

  turnOnLed() {
    this.chipsService.turnOnLed(this.selectedChip).subscribe(chip => {
      this.selectedChip = chip;
      setTimeout(() => { this.refreshData()}, 5000);
    });
  }

  turnOffLed() {
    this.chipsService.turnOffLed(this.selectedChip).subscribe(chip => {
      this.selectedChip = chip;
      setTimeout(() => { this.refreshData()}, 5000);
    });
  }

  delete(chip: Chip) {
    this.selectedChip = chip;
    this.chipsService.delete(this.selectedChip).subscribe(chip => {
      this.selectedChip.mac = "";
      setTimeout(() => { this.refreshData()}, 5000);
    });
  }

  update() {
    this.chipsService.update(this.selectedChip).subscribe(chip => {
      this.selectedChip = chip;
    });
  }

}
