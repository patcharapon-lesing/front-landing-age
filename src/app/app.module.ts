import '@angular/localize/init'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FindCasePageComponent } from './find-case-page/find-case-page.component';
import {ExcelService} from '../app/services/excel.services';
import { FormsModule , } from '@angular/forms';
import { DetailsPageComponent } from './details-page/details-page.component';
import { CreateCasePageComponent } from './create-case-page/create-case-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    FindCasePageComponent,
    DetailsPageComponent,
    CreateCasePageComponent,
  ],
  imports: [

    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DataTablesModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [ExcelService],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
