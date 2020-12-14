import { FormsModule } from '@angular/forms';
import { Chip } from '../chip-detail/chip';
import { Component, OnInit } from '@angular/core';
import { ChipsService } from './chips.service';

@Component({
  selector: 'app-chip',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.css']
})

export class ChipComponent implements OnInit {
  chips: Chip[] = [];
  selectedChip: Chip = new Chip("","","");
  constructor( private chipsService: ChipsService) { }

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

}
