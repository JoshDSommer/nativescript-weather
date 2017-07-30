// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";

import { AppModule } from "./app.module";

// A traditional NativeScript application starts by initializing global objects, setting up global CSS rules, creating, and navigating to the main page. 
// Angular applications need to take care of their own initialization: modules, components, directives, routes, DI providers. 
// A NativeScript Angular app needs to make both paradigms work together, so we provide a wrapper platform object, platformNativeScriptDynamic, 
// that sets up a NativeScript application and can bootstrap the Angular framework.
platformNativeScriptDynamic().bootstrapModule(AppModule);



// this import should be first in order to load some required settings (like globals and reflect-metadata)
/*import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NgModule, enableProdMode } from "@angular/core";
import { TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe } from 'nativescript-ng2-fonticon'
import { NativeScriptRouterModule } from 'nativescript-angular/router'
import { NativeScriptHttpModule } from 'nativescript-angular/http';

import { WeatherAppComponent } from "./app.component";
import { ForecastCardComponent, ForecastComponent, LocationsComponent, NetworkIssueComponent } from './components';


@NgModule({
    declarations: [
        WeatherAppComponent,
        ForecastCardComponent,
        ForecastComponent,
        NetworkIssueComponent,
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
            }, false)
        }
    }],
})
class AppComponentModule { }

platformNativeScriptDynamic().bootstrapModule(AppComponentModule);
*/