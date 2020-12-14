import { ChipsService } from './chips/chips.service';
import { ChipService } from './chip-detail/chip.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { ChipComponent } from './chips/chips.component';
import { ChipDetailComponent } from './chip-detail/chip-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    ChipComponent,
    ChipDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ChipsService,ChipService],
  bootstrap: [AppComponent]
})
export class AppModule { }
