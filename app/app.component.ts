
import { Component, OnDestroy } from "@angular/core";
import { ForecastIOService, LocationService, ILocationInfo, PageDimensions, PositioningService, ConnectivityService } from './services';
import { SwissArmyKnife } from 'nativescript-swiss-army-knife';
import { TNSFontIconService } from 'nativescript-ng2-fonticon';
import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router'


import { connectionType as ConnectionType, getConnectionType, startMonitoring, stopMonitoring } from 'connectivity'
import { NavigationOptions } from "nativescript-angular/router/ns-location-strategy";
import { NavigationTransition } from "tns-core-modules/ui/frame";

declare const android: any;

@Component({

    selector: "weather-app",
    templateUrl: "app.component.html",
    providers: [ForecastIOService, LocationService, PageDimensions, PositioningService, ConnectivityService]
})
export class WeatherAppComponent implements OnDestroy {
    public cityTemp: string;
    public forecast: boolean;
    public location: ILocationInfo;

    constructor(
        private router: RouterExtensions,
        private forecastIOService: ForecastIOService,
        private locationService: LocationService,
        private connectivityService: ConnectivityService,
        private fonticon: TNSFontIconService) {

    }

    public getStatusBarHeight() {
        let result = 0;
        let resourceId = android.getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > '0') {
            result = android.getResources().getDimensionPixelSize(resourceId);
        }
        return result;
    }
    ngAfterViewInit(): void {
        SwissArmyKnife.actionBarSetStatusBarStyle(1);
        SwissArmyKnife.setAndroidNavBarColor('#644749');
        SwissArmyKnife.setAndroidStatusBarColor('#8ba192');

        this.connectivityService.startMonitoring((newConnectionType: ConnectionType) => {
            if (newConnectionType === ConnectionType.none) {
                this.router.navigate(['/network'], { clearHistory: true, transition: { name: 'slideTop' } });
            } else {
                this.router.navigate(['/location'], { clearHistory: true, transition: { name: 'slideTop' } });
            }
        });
    }

    ngOnDestroy() {
        this.connectivityService.stopMonitoring();
    }
}