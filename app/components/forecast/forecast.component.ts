import {BaseComponent, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit, ChangeDetectorRef  } from "@angular/core";
import * as app from 'application';
import * as Platform from 'platform';
import {Router} from '@angular/router-deprecated';
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

declare const android: any;



@BaseComponent({
	selector: 'forecast-component',
	template: `
		<GridLayout row="*" columns="auto,auto,auto" class="nav-bar" width="100%" verticalAlignment="top" orientation="horizontal">
			<Label (touch)="gotoLocations($event)" verticalAlignment="bottom" width="20" row="0" col="0" class="fa" [text]="'fa-map-marker' | fonticon" ></Label>
			<Label verticalAlignment="bottom" width="70%" row="0" col="1" textAlign="left" class="location-text"  [text]="cityTemp" horizontalAlign="left" textWrap="true"></Label>
			<Label verticalAlignment="bottom" width="20" row="0" col="2" horizontalAlign="right" class="fa" [text]="'fa-refresh' | fonticon" ></Label>
		</GridLayout>
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
	styleUrls: ['theme-natural.css'],
	styles: [`

			Page{
			background-color:#8ba892;
		}

		#container-wrapper{
			background-color:#8ba892;
		}

		.nav-bar{
			color:#fff;
		}

		.morning{
			background-color: #e3bb88;
		}
			.morning-icon{
				color: #d89864;
			}

		.day{
			background-color: #d89864
		}
			.day-icon{
				color: #644749;
			}
		.evening{
			background-color: #b1695a;
		}
			.evening-icon{
				color: #e3bb88;
			}

		.night{
			background-color: #644749;
		}
			.night-icon{
				color:#d89864;
			}
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
		page.actionBarHidden = true;
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
		// if (currentLocation == null) {
		// 	this.router.navigate(['location']);
		// }
		currentLocation = <any>{};
		currentLocation.lat = "40.7989";
		currentLocation.lng = "-81.3784";
		forecastIOService.getForecast(currentLocation.lat, currentLocation.lng).subscribe((value) => {
			console.log('got forecast' + JSON.stringify(value));
			this.forecast.location = value.location;
			this.forecast.temperature = value.temperature;
			this.cityTemp = `Canton Ohio ${this.forecast.temperature}\u00B0`;
			this.forecast.day = value.day;
			this.forecast.evening = value.evening;
			this.forecast.morning = value.morning;
			this.forecast.night = value.night;
			ref.detectChanges();
		});
	}

	gotoLocations(e: gestures.TouchGestureEventData): void {
		if (e.action === 'up') {
			this.router.navigate(['Location']);
		}
	}

	ngAfterViewInit(): void {
		// let dayCard = this.day.nativeElement;
		if (app.android) {
			//	SwissArmyKnife.actionBarSetStatusBarStyle(1);
		}



		console.log(this.positioning.night);
		setTimeout(() => {
			(<any>this.evening).selectCard();
		}, 100);
	}
}
