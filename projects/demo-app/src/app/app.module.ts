import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CustomFlexBoxModule } from 'custom-flexbox';

import { AppComponent } from './app.component';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CustomFlexBoxModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
