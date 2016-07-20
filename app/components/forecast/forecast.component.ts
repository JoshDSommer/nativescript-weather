
/// <reference path="../../../node_modules/nativescript-pulltorefresh/pulltorefresh.d.ts" />

import {Component, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit, ChangeDetectorRef, OnInit  } from "@angular/core";
import * as app from 'application';
import * as Platform from 'platform';
import {Router} from '@angular/router';
import {TNSFontIconService, TNSFontIconPipe} from 'nativescript-ng2-fonticon';
import {ForecastCardComponent, } from '../forecast-card/forecast-card.component';
import {PageDimensions, IDimensions} from '../../services/page-dimensions.service';
import {IForecastCardInfo, ForecastIOService, IForecast } from '../../services/forecast.io.services';
import {ILocationInfo, LocationService } from '../../services/location.service';
import {PositioningService, ISelectedCard, cardNames } from '../../services/positioning.service';
import * as gestures from 'ui/gestures';
import {StackLayout} from 'ui/layouts/stack-layout';
import {Observable} from 'rxjs/observable';
import {Subscription} from 'rxjs/subscription';
import {topmost} from 'ui/frame';
import {Page} from 'ui/page';
import {Label} from 'ui/label';
import {Color} from 'color';
import {PullToRefresh} from 'nativescript-pulltorefresh';
import { registerElement, ViewClass } from 'nativescript-angular/element-registry';
import {SwissArmyKnife} from 'nativescript-swiss-army-knife/nativescript-swiss-army-knife';

registerElement('PullToRefresh', () => require('nativescript-pulltorefresh').PullToRefresh);

declare const android: any;



@Component({
	selector: 'forecast-component',
	template: `
	<GridLayout>
		<ActionBar title="" class="action-bar">
			<NavigationButton visibility="collapsed"></NavigationButton>
			<StackLayout orientation="horizontal">
				<Label (touch)="gotoLocations($event)" verticalAlignment="bottom" paddingLeft="10" width="25" class="fa" text="\uf041" ></Label>
				<Label (touch)="gotoLocations($event)" verticalAlignment="bottom" width="80%" textAlign="left" class="location-text"  [text]="cityTemp" horizontalAlign="left" textWrap="true"></Label>
				<Label (touch)="refreshPage($event)" verticalAlignment="bottom" width="30" class="fa" text="\uf021"></Label>
			</StackLayout>
		</ActionBar>
		<PullToRefresh (refresh)="refreshPage($event)">
			<StackLayout>
				<AbsoluteLayout id="slider-container">
					<forecast-card [state]=0 [forecast]="forecast.morning" [height]="dimensions.cardSize" [top]="dimensions.morningOffset" #morning></forecast-card>
					<forecast-card [state]=0 [forecast]="forecast.day" [height]="dimensions.cardSize" [top]="dimensions.dayOffset" #day></forecast-card>
					<forecast-card [state]=0 [forecast]="forecast.evening" [height]="dimensions.cardSize" [top]="dimensions.eveningOffset" #evening></forecast-card>
					<forecast-card [state]=1 [forecast]="forecast.night" [height]="dimensions.cardSize" [top]="dimensions.nightOffset" #night></forecast-card>
				</AbsoluteLayout>
			</StackLayout>
		</PullToRefresh>
	</GridLayout>
`,
	directives: [ForecastCardComponent],
	providers: [PageDimensions, PositioningService],
	pipes: [TNSFontIconPipe],
	styleUrls: ['theme-natural.css', 'app.css'],
	styles: [`

	`]
})
export class ForecastComponent implements AfterViewInit, OnInit {
	@ViewChild('morning') public morning: ElementRef;
	@ViewChild('day') public day: ElementRef;
	@ViewChild('evening') public evening: ElementRef;
	@ViewChild('night') public night: ElementRef;
	public forecast: IForecast;
	public cityTemp: string;
	public dimensions: IDimensions;
	public forecastDate: number;
	private placeholderInfo = { icon: '', temperature: 0, windSpeed: 0, windBearing: 0, summary: '', humidity: 0 };
	private subsciption: Subscription;

	constructor(private router: Router, private ref: ChangeDetectorRef, private pageDimensions: PageDimensions, private positioning: PositioningService, private forecastIOService: ForecastIOService, private locationService: LocationService) {

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

		this.refreshForecast();


	}
	public refreshPage(args: any) {
		console.log("page refresh -> go");
		let pullRefresh = args.object;
		this.cityTemp = `Refreshing Forecast`;
		// this.forecast = {
		// 	temperature: 0,
		// 	location: 'Refreshing',
		// 	morning: this.forecastIOService.extractForecastCardInfo(this.placeholderInfo, 'morning', 0),
		// 	day: this.forecastIOService.extractForecastCardInfo(this.placeholderInfo, 'day', 0),
		// 	evening: this.forecastIOService.extractForecastCardInfo(this.placeholderInfo, 'evening', 0),
		// 	night: this.forecastIOService.extractForecastCardInfo(this.placeholderInfo, 'night', 0),
		// };
		this.ref.detectChanges();
		setTimeout(() => {
			this.refreshForecast(pullRefresh);
		}, 1500);
	}

	ngOnDestroy(): void{
		this.subsciption.unsubscribe();
	}

	refreshForecast(pullRefresh?: any): void {
		SwissArmyKnife.actionBarHideBackButton();

		let currentLocation = this.locationService.getStoredLocations();
		if (currentLocation == null) {
			setTimeout(() => this.router.navigate(['/location']), 1000)
		}
		this.subsciption = this.forecastIOService.getForecast(currentLocation.lat, currentLocation.lng).subscribe((value) => {
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

	refresh(e: gestures.TouchGestureEventData): void {
		if (e.action === 'up') {
			(<Label>e.object).opacity = 1;
			this.refreshForecast();

		} else if (e.action === 'down') {
			(<Label>e.object).opacity = 0.5;
		}
	}

	gotoLocations(e: gestures.TouchGestureEventData): void {
		if (e.action === 'up') {
			(<Label>e.object).opacity = 1;
			this.router.navigate(['/location']);

		} else if (e.action === 'down') {
			(<Label>e.object).opacity = 0.5;
		}
	}
	ngOnInit() {
	}
	ngAfterViewInit(): void {
	}

}
