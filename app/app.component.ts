import {Component, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit, ChangeDetectorRef  } from "@angular/core";
import {NgIf } from '@angular/common';
import {RouterConfig} from "@angular/router";
import {topmost} from 'ui/frame';
import {SwissArmyKnife} from 'nativescript-swiss-army-knife/nativescript-swiss-army-knife';
import {Page} from 'ui/page';
import {TNSFontIconService, TNSFontIconPipe} from 'nativescript-ng2-fonticon';
import {IForecastCardInfo, ForecastIOService, IForecast } from './services/forecast.io.services';
import {ILocationInfo, LocationService} from './services/location.service';
import {NS_ROUTER_DIRECTIVES, nsProvideRouter} from 'nativescript-angular/router';
import * as app from 'application';
import {Color} from 'color';
import * as Platform from 'platform';

declare const android: any;


@Component({
	selector: 'weather-app',
	template: `
		<page-router-outlet></page-router-outlet>
	`,
	styles: [
		`
			#constainter-wrapper{
				padding-top:20;
			}
		`
	],

	providers: [ForecastIOService, LocationService]
})
export class WeatherAppComponent {
	public cityTemp: string;
	public forecast: boolean;
	public location: ILocationInfo;

	@ViewChild('wrapper') stackLayout: ElementRef;

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

var routes: RouterConfig = [
	{ path: "", component: ForecastComponent },
	{ path: "location", component: LocationsComponent },
	{ path: "network", component: NetworkIssueComponent },
];

export var APP_ROUTES = [
	nsProvideRouter(routes, { enableTracing: false })
]