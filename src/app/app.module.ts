import { ChipsService } from './chips/chips.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { ChipComponent } from './chips/chips.component';

@NgModule({
  declarations: [
    AppComponent,
    ChipComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ChipsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
