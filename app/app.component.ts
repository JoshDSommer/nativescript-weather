import {Component, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit, ChangeDetectorRef  } from "@angular/core";
import {NgIf } from '@angular/common';
import {RouterConfig} from "@angular/router";
import {ForecastComponent} from './components/forecast/forecast.component';
import {LocationsComponent} from './components/locations/locations.component';
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
	directives: [ForecastComponent, LocationsComponent, NgIf, NS_ROUTER_DIRECTIVES],
	providers: [ForecastIOService, LocationService],
	pipes: [TNSFontIconPipe],
	encapsulation: ViewEncapsulation.Emulated
})
export class WeatherAppComponent {
	public cityTemp: string;
	public forecast: boolean;
	public location: ILocationInfo;

	@ViewChild('wrapper') stackLayout: ElementRef;

	constructor(private forecastIOService: ForecastIOService, private locationService: LocationService) {
		// this.forecast = false;
		// let page = <Page>topmost().currentPage;
		// page.actionBarHidden = true;
		//	themes.applyTheme('theme-natural.css');
		//page.style.paddingTop = 50;// SwissArmyKnife.getScreenHeight().androidStatusBar;
		// locationService.getLogLat().then(() => {
		// 	locationService.getCityName().subscribe((value: string) => {
		// 		this.cityTemp = value;

		// 	});
		// });
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
		if (app.android && Platform.device.sdkVersion >= '19') {
			let window = app.android.startActivity.getWindow();
			window.setStatusBarColor(new Color('#8ba192').android);
			window.setNavigationBarColor(new Color('#644749').android);
		}
	}
}

var routes: RouterConfig = [
	{ path: "", component: ForecastComponent },
	{ path: "location", component: LocationsComponent }
];

export var APP_ROUTES = [
	nsProvideRouter(routes, { enableTracing: false })
]