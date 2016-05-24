import {Component, ViewChild, ViewEncapsulation, ElementRef } from "@angular/core";
import {TNSFontIconService, TNSFontIconPipe} from 'nativescript-ng2-fonticon';
import {ForecastCardComponent, } from './components/forecast-card.component';
import {PageDimensions, IDimensions} from './services/page-dimensions.service';
import {IForecastCardInfo } from './services/forecast.io.services';

export const morningCardColor = '#e3bb88';
export const dayCardColor = '#d89864';
export const eveningCardColor = '#b1695a';
export const nightCardColor = '#644749';



@Component({
	selector: "weather-app",
	template: `
	<ActionBar class="nav-bar">
	  <StackLayout orientation="horizontal"
		ios:horizontalAlignment="left"
		android:horizontalAlignment="left">
		<Label text="nativescript-weather"></Label>
	  </StackLayout>
	</ActionBar>
	<StackLayout>
		<AbsoluteLayout id="slider-container">
			<!-- setting bg color like this temporary, just for the ability to see the cards the correct colors :)....-->
			<forecast-card [forecast]="tempMorning" [height]="dimensions.cardSize" [top]="dimensions.morningOffset" #morning></forecast-card>
			<forecast-card [forecast]="tempDay"[height]="dimensions.cardSize" [top]="dimensions.dayOffset" #day></forecast-card>
			<forecast-card [forecast]="tempEvening"[height]="dimensions.cardSize" [top]="dimensions.eveningOffset" #evening></forecast-card>
			<forecast-card [forecast]="tempNight"[height]="dimensions.cardSize" [top]="dimensions.nightOffset" #night></forecast-card>
		</AbsoluteLayout>
	</StackLayout>
`,
	directives: [ForecastCardComponent],
	providers: [PageDimensions],
	styles: [`
		#slider-container{
			height:100%;
			background-color:pink;
		}
		.nav-bar{
			background-color:#8ba892;
			color:#fff;
		}
	`],
	encapsulation: ViewEncapsulation.Emulated
})
export class WeatherAppComponent {
	@ViewChild('morning') public morning: ElementRef;
	@ViewChild('day') public day: ElementRef;
	@ViewChild('evening') public evening: ElementRef;
	@ViewChild('night') public night: ElementRef;
	public tempNight = <IForecastCardInfo>{
		timeOfDay: 'NIGHT',
		icon: "wi-forecast-io-partly-cloudy-night",
		summary: "Mostly Cloudy",
		temperature: 74,
		temperatureDiff: 0,
		windSpeed: 5,
		windBearing: 'W',
		bgColor: '#644749',
		humidity: 75,
		iconColor: "#d89864"
	};
	public tempEvening = <IForecastCardInfo>{
		timeOfDay: 'EVENING',
		icon: "wi-forecast-io-partly-cloudy-night",
		summary: "Mostly Cloudy",
		temperature: 74,
		temperatureDiff: 0,
		windSpeed: 5,
		windBearing: 'W',
		bgColor: '#b1695a',
		humidity: 75,
		iconColor: "#e3bb88"
	};

	public tempDay = <IForecastCardInfo>{
		timeOfDay: 'DAY',
		icon: "wi-forecast-io-partly-cloudy-night",
		summary: "Mostly Cloudy",
		temperature: 74,
		temperatureDiff: 0,
		windSpeed: 5,
		windBearing: 'W',
		bgColor: '#d89864',
		humidity: 75,
		iconColor: "#644749"
	};

	public tempMorning = <IForecastCardInfo>{
		timeOfDay: 'DAY',
		icon: "wi-forecast-io-partly-cloudy-night",
		summary: "Mostly Cloudy",
		temperature: 74,
		temperatureDiff: 0,
		windSpeed: 5,
		windBearing: 'W',
		bgColor: '#e3bb88',
		humidity: 75,
		iconColor: "#d89864"
	};
	public dimensions: IDimensions;
	constructor(private pageDimensions: PageDimensions) {
		pageDimensions.getDimensions().subscribe((data: IDimensions) => {
			this.dimensions = data;
		});
	}
}
