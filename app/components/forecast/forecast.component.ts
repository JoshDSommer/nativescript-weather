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
import {Color} from 'color';

declare const android: any;



@Component({
	selector: 'forecast-component',
	template: `
	<GridLayout>
		<!---->
		<ActionBar title="" class="action-bar">
			<StackLayout orientation="horizontal">
				<Label (touch)="gotoLocations($event)" verticalAlignment="bottom" paddingLeft="10" width="40" class="fa" text="\uf041" ></Label>
				<Label (touch)="gotoLocations($event)" verticalAlignment="bottom" width="80%" textAlign="left" class="location-text"  [text]="cityTemp" horizontalAlign="left" textWrap="true"></Label>
				<Label (touch)="refresh($event)" verticalAlignment="bottom" width="50" class="fa" text="\uf021"></Label>
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
	public forecastDate: number;

	constructor(private router: Router, private ref: ChangeDetectorRef, private pageDimensions: PageDimensions, private positioning: PositioningService, private forecastIOService: ForecastIOService, private locationService: LocationService) {
		let page = <Page>topmost().currentPage;
		// page.actionBarHidden = true;
		// themes.applyTheme('theme-natural.css');
		if (app.android && Platform.device.sdkVersion >= '19') {
			let window = app.android.foregroundActivity.getWindow();
			let LayoutParams = <any>android.view.WindowManager.LayoutParams;
			window.addFlags(LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
			window.setStatusBarColor(new Color('#8ba192').android);
			window.setNavigationBarColor(new Color('#644749').android);
		}
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

		this.refreshForecast();


	}

	refreshForecast(): void {
		let currentLocation = this.locationService.getStoredLocations();
		if (currentLocation == null) {
			this.router.navigate(['/location']);
		}
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

	ngAfterViewInit(): void {

	}
}
