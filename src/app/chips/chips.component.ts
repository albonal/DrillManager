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

  @Input() selectedChip: Chip = new Chip("","","");

  constructor(private chipsService: ChipsService) { }

  ngOnInit(): void {
    this.getChips();
  }

  onSelect(chip: Chip) {
    this.selectedChip = chip;
  }

  getChips() {
    return this.chipsService.getChips().subscribe(chips => {
      this.chips = chips;
    });
  }

  
  turnOnLed() {
    this.chipsService.turnOnLed(this.selectedChip).subscribe(chip => {
      this.selectedChip = chip;
    });
  }

  turnOffLed() {
    this.chipsService.turnOffLed(this.selectedChip).subscribe(chip => {
      this.selectedChip = chip;
    });
  }

  delete() {
    this.chipsService.delete(this.selectedChip).subscribe(chip => {
      this.selectedChip = chip;
    });
    this.selectedChip.mac = "";
  }

  update() {
    this.chipsService.update(this.selectedChip).subscribe(chip => {
      this.selectedChip = chip;
    });
  }

}
