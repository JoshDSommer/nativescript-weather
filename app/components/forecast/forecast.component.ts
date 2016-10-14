
import { Component, ViewChild, ViewEncapsulation, OnChanges, ElementRef, AfterViewInit, ChangeDetectorRef, OnInit } from "@angular/core";
import * as app from 'application';
import * as Platform from 'platform';
import { RouterExtensions } from 'nativescript-angular/router'
import { TNSFontIconService, TNSFontIconPipe } from 'nativescript-ng2-fonticon';
import { ForecastCardComponent, } from '../forecast-card/forecast-card.component';
import { PageDimensions, IDimensions, IForecastCardInfo, ConnectivityService, ForecastIOService, IForecast, ILocationInfo, LocationService, PositioningService, ISelectedCard, cardNames } from '../../services';
import { StackLayout } from 'ui/layouts/stack-layout';
import { Observable, Subscription } from 'rxjs/Rx';
import { topmost } from 'ui/frame';
import { Page } from 'ui/page';
import { Label } from 'ui/label';
import { Color } from 'color';
import { PullToRefresh } from 'nativescript-pulltorefresh';
import { registerElement, ViewClass } from 'nativescript-angular/element-registry';

import { SwissArmyKnife } from 'nativescript-swiss-army-knife/nativescript-swiss-army-knife';

registerElement('PullToRefresh', () => require('nativescript-pulltorefresh').PullToRefresh);
declare const android: any;



@Component({
	selector: 'forecast-component',
	templateUrl: './components/forecast/forecast.component.html',
	styleUrls: ['theme-natural.css', 'app.css'],
})
export class ForecastComponent implements OnChanges, OnInit {
	@ViewChild('morning') public morning: ElementRef;
	@ViewChild('day') public day: ElementRef;
	@ViewChild('evening') public evening: ElementRef;
	@ViewChild('night') public night: ElementRef;

	public isErrorVisible: boolean;
	public isConnectingVisible: boolean;
	public forecast: IForecast;
	public cityTemp: string;
	public dimensions: IDimensions;
	public forecastDate: number;
	private placeholderInfo = { icon: '', temperature: 0, windSpeed: 0, windBearing: 0, summary: '', humidity: 0 };

	constructor(private router: RouterExtensions,
		private ref: ChangeDetectorRef,
		private pageDimensions: PageDimensions,
		private positioning: PositioningService,
		private forecastIOService: ForecastIOService,
		private locationService: LocationService,
		private fonticon: TNSFontIconService,
		private conntectivityService: ConnectivityService) {

		this.isErrorVisible = false;
		this.isConnectingVisible = true;
		this.forecast = {
			temperature: 0,
			location: 'Refreshing',
			morning: this.forecastIOService.extractForecastCardInfo(this.placeholderInfo, 'morning', 0),
			day: this.forecastIOService.extractForecastCardInfo(this.placeholderInfo, 'day', 0),
			evening: this.forecastIOService.extractForecastCardInfo(this.placeholderInfo, 'evening', 0),
			night: this.forecastIOService.extractForecastCardInfo(this.placeholderInfo, 'night', 0),
		};

		pageDimensions.getDimensions().subscribe((data: IDimensions) => {
			this.dimensions = data;
			this.positioning.movementDistance = data.cardRowSize;
		});



	}
	public refreshPage(args: any) {
		console.log("page refresh -> go");
		let pullRefresh = args.object;
		this.cityTemp = `Refreshing Forecast`;
		this.ref.detectChanges();
		setTimeout(() => {
			this.refreshForecast(pullRefresh);
		}, 1500);
	}

	ngOnDestroy(): void {
		this.isErrorVisible = false;
		this.isConnectingVisible = true;
	}

	refreshForecast(pullRefresh?: any): void {
		//SwissArmyKnife.actionBarHideBackButton();

		let currentLocation = this.locationService.getStoredLocations();
		if (currentLocation == null) {
			this.router.navigate(['/location'], { clearHistory: true, transition: 'slideTop' });
		} else {
			// this.isConnectingVisible = true;
			// this.subsciption = this.forecastIOService.getForecast(currentLocation.lat, currentLocation.lng).subscribe((value) => {
			// 	this.isErrorVisible = false;
			// 	this.isConnectingVisible = false;
			// 	// setTimeout(() => {
			// 	if ((<any>this.morning).selected === false) {
			// 		(<any>this.morning).selectCard();
			// 	}
			// 	// }, 100);
			// 	this.forecast.location = value.location;
			// 	this.forecast.temperature = value.temperature;
			// 	this.cityTemp = `${currentLocation.name} - ${this.forecast.temperature}\u00B0`;
			// 	this.forecast.day = value.day;
			// 	this.forecast.evening = value.evening;
			// 	this.forecast.morning = value.morning;
			// 	this.forecast.night = value.night;
			// 	this.ref.detectChanges();
			// 	if (pullRefresh != null) {
			// 		pullRefresh.refreshing = false;
			// 	}
			// }, (error) => {
			// 	console.log('Error !!!!');
			// 	this.isErrorVisible = true;
			// 	this.cityTemp = 'Set your location';
			// });
			// // }
			SwissArmyKnife.actionBarHideBackButton();

			this.forecastIOService.getForecast(currentLocation.lat, currentLocation.lng).subscribe((value) => {
				setTimeout(() => {
					if ((<any>this.morning).selected === false) {
						(<any>this.morning).selectCard();
					}
				}, 100);
				this.forecast.location = value.location;
				this.forecast.temperature = value.temperature;
				this.cityTemp = `${currentLocation.name} - ${this.forecast.temperature}\u00B0`;
				this.forecast.day = value.day;
				this.forecast.evening = value.evening;
				this.forecast.morning = value.morning;
				this.forecast.night = value.night;
				this.ref.detectChanges();
				if (pullRefresh != null) {
					pullRefresh.refreshing = false;
				}

			});
		}
	}

	refresh(e: any): void {
		if (e.action === 'up') {
			(<Label>e.object).opacity = 1;
			this.refreshForecast();

		} else if (e.action === 'down') {
			(<Label>e.object).opacity = 0.5;
		}
	}

	ngOnInit() {
		this.isErrorVisible = false;
		this.isConnectingVisible = true;
		this.refreshForecast();
	}
	ngOnChanges(): void {
		console.log('On Changes');
	}

}
