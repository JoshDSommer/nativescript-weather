// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe } from 'nativescript-ng2-fonticon'
import { NativeScriptRouterModule } from 'nativescript-angular/router'
import { NativeScriptHttpModule } from 'nativescript-angular/http';

import { WeatherAppComponent } from "./app.component";
import { ForecastCardComponent, ForecastComponent, LocationsComponent } from './components';
import { providedRoutes } from './app.routes';

@NgModule({
    declarations: [
        WeatherAppComponent,
        ForecastCardComponent,
        ForecastComponent,
        LocationsComponent,
        TNSFontIconPurePipe,
        TNSFontIconPipe
    ],
    bootstrap: [WeatherAppComponent],
    imports: [
        NativeScriptModule,
        NativeScriptRouterModule,
        providedRoutes,
        NativeScriptHttpModule
    ],
    providers: [{
        provide: TNSFontIconService,
        useFactory: () => {
            return new TNSFontIconService({
                'wi': 'weather-icons.css',
                'fa': 'font-awesome.css'
            }, true)
        }
    }],
})
class AppComponentModule { }

platformNativeScriptDynamic().bootstrapModule(AppComponentModule);