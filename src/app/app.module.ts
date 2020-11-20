import { DrillService } from './drill.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DrillComponent } from './drill/drill.component';

@NgModule({
  declarations: [
    AppComponent,
    DrillComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [DrillService],
  bootstrap: [AppComponent]
})
export class AppModule { }
