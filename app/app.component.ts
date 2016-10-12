
import { Component } from "@angular/core";
import { ForecastIOService, LocationService, ILocationInfo, PageDimensions, PositioningService } from './services';
import { SwissArmyKnife } from 'nativescript-swiss-army-knife';
import { TNSFontIconService } from 'nativescript-ng2-fonticon';
declare const android: any;

@Component({

    selector: "weather-app",
    templateUrl: "app.component.html",
    providers: [ForecastIOService, LocationService, PageDimensions, PositioningService]
})
export class WeatherAppComponent {
    public cityTemp: string;
    public forecast: boolean;
    public location: ILocationInfo;

    constructor(private forecastIOService: ForecastIOService, private locationService: LocationService) {

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
    }
}