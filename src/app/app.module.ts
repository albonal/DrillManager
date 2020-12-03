import { DrillService } from './drill.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { DrillComponent } from './drill.component';

@NgModule({
  declarations: [
    AppComponent,
    DrillComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [DrillService],
  bootstrap: [AppComponent]
})
export class AppModule { }
