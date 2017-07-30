import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";

import { WeatherAppComponent } from "./app.component";
import { ForecastCardComponent, ForecastComponent, LocationsComponent, NetworkIssueComponent } from './components';


// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
//import { TNSFontIconService, TNSFontIconPurePipe, TNSFontIconPipe } from "nativescript-ng2-fonticon";
import { TNSFontIconModule } from 'nativescript-ng2-fonticon';


@NgModule({
    bootstrap: [
        WeatherAppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptHttpModule,
        AppRoutingModule,
        TNSFontIconModule.forRoot({
            'wi': 'weather-icons.css',
            'fa': 'font-awesome.css'
        })
    ],
    declarations: [
        WeatherAppComponent,
        ForecastCardComponent,
        ForecastComponent,
        NetworkIssueComponent,
        LocationsComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
