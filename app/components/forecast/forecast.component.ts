import {Component, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit, ChangeDetectorRef  } from "@angular/core";
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
import {topmost} from 'ui/frame';
import {Page} from 'ui/page';
import {Label} from 'ui/label';

declare const android: any;



@Component({
	selector: 'forecast-component',
	template: `
	<GridLayout>
		<!---->
		<ActionBar title="" class="action-bar">
			<StackLayout orientation="horizontal">
				<Label (touch)="gotoLocations($event)" verticalAlignment="bottom" width="40" class="fa" [text]="'fa-map-marker' | fonticon" ></Label>
				<Label verticalAlignment="bottom" width="80%" textAlign="left" class="location-text"  [text]="cityTemp" horizontalAlign="left" textWrap="true"></Label>
				<Label (touch)="gotoLocations($event)" verticalAlignment="bottom" width="20" class="fa" [text]="'fa-refresh' | fonticon" ></Label>
			</StackLayout>
		</ActionBar>
		<AbsoluteLayout id="slider-container">
			<forecast-card [state]=0 [forecast]="forecast.morning" [height]="dimensions.cardSize" [top]="dimensions.morningOffset" #morning></forecast-card>
			<forecast-card [state]=0 [forecast]="forecast.day" [height]="dimensions.cardSize" [top]="dimensions.dayOffset" #day></forecast-card>
			<forecast-card [state]=0 [forecast]="forecast.evening" [height]="dimensions.cardSize" [top]="dimensions.eveningOffset" #evening></forecast-card>
			<forecast-card [state]=1 [forecast]="forecast.night" [height]="dimensions.cardSize" [top]="dimensions.nightOffset" #night></forecast-card>
		</AbsoluteLayout>

`,
	directives: [ForecastCardComponent],
	providers: [PageDimensions, PositioningService],
	pipes: [TNSFontIconPipe],
	styleUrls: ['theme-natural.css', 'app.css'],
	styles: [`

	`]
})
export class ForecastComponent implements AfterViewInit {
	@ViewChild('morning') public morning: ElementRef;
	@ViewChild('day') public day: ElementRef;
	@ViewChild('evening') public evening: ElementRef;
	@ViewChild('night') public night: ElementRef;
	public forecast: IForecast;
	public cityTemp: string;
	public dimensions: IDimensions;

	constructor(private router: Router, private ref: ChangeDetectorRef, private pageDimensions: PageDimensions, private positioning: PositioningService, private forecastIOService: ForecastIOService, private locationService: LocationService) {
		let page = <Page>topmost().currentPage;
		// page.actionBarHidden = true;
		// themes.applyTheme('theme-natural.css');

		let placeholderInfo = { icon: '', temperature: 0, windSpeed: 0, windBearing: 0, summary: '', humidity: 0 };
		this.forecast = {
			temperature: 0,
			location: 'Canton Ohio',
			morning: forecastIOService.extractForecastCardInfo(placeholderInfo, 'morning', 0),
			day: forecastIOService.extractForecastCardInfo(placeholderInfo, 'day', 0),
			evening: forecastIOService.extractForecastCardInfo(placeholderInfo, 'evening', 0),
			night: forecastIOService.extractForecastCardInfo(placeholderInfo, 'night', 0),
		};

		pageDimensions.getDimensions().subscribe((data: IDimensions) => {
			this.dimensions = data;
			this.positioning.movementDistance = data.cardRowSize;
		});

		let currentLocation = this.locationService.getStoredLocations();
		if (currentLocation == null) {
			this.router.navigate(['/location']);
		}
		forecastIOService.getForecast(currentLocation.lat, currentLocation.lng).subscribe((value) => {
			console.log('got forecast' + JSON.stringify(value));
			this.forecast.location = value.location;
			this.forecast.temperature = value.temperature;
			this.cityTemp = `${currentLocation.name} ${this.forecast.temperature}\u00B0`;
			this.forecast.day = value.day;
			this.forecast.evening = value.evening;
			this.forecast.morning = value.morning;
			this.forecast.night = value.night;
			ref.detectChanges();
		});
	}

	gotoLocations(e: gestures.TouchGestureEventData): void {
		if (e.action === 'up') {
			console.log('lookup clicked');
			(<Label>e.object).opacity = 1;
			this.router.navigate(['/location']);

		} else if (e.action === 'down') {
			(<Label>e.object).opacity = 0.5;
		}
	}

	ngAfterViewInit(): void {
		// let dayCard = this.day.nativeElement;
		if (app.android) {
			//	SwissArmyKnife.actionBarSetStatusBarStyle(1);
		}



		console.log(this.positioning.night);
		setTimeout(() => {
			(<any>this.morning).selectCard();
		}, 100);
	}
}
