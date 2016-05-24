import { Component, ViewEncapsulation, OnInit, Input, ElementRef, ViewChild, AfterContentInit } from '@angular/core';
import {SwissArmyKnife} from 'nativescript-swiss-army-knife/nativescript-swiss-army-knife';
import {TNSFontIconService, TNSFontIconPipe} from 'nativescript-ng2-fonticon';
import {IForecastCardInfo} from '../services/forecast.io.services';

export enum CardState {
	hidden = 0,
	visible = 1
}

@Component({
	selector: 'forecast-card',
	template: `
	<StackLayout #cardWrapper  class="slider" [left]="left" [top]="top" [height]="height">
		<AbsoluteLayout #card class="card" [width]="width" [height]="height/4 *3" [marginTop]="height/4" [backgroundColor]="forecast?.bgColor">
			<Label top="0" [color]="forecast?.iconColor" left="40" class="wi"  [text]="forecast?.icon | fonticon"></Label>
			<StackLayout top="10" left="200">
				<Label class="time" [text]="forecast?.timeOfDay"></Label>
				<Label [text]="forecast?.temperature + '\u00B0'" class="info-text degrees" textWrap="true"></Label>
				<StackLayout class="forecast">
					<Label [text]="forecast?.summary" class="info-text summary" textWrap="true"></Label>
					<Label [text]="'Wind: ' + forecast?.windBearing + ' ' + forecast?.windSpeed + ' mph'" class="info-text wind" textWrap="true"></Label>
					<Label [text]="'Humidity' + forecast?.humidity + '%'" class="info-text humidity" textWrap="true"></Label>
				</StackLayout>
			</StackLayout>
		</AbsoluteLayout>
	</StackLayout>
	`,
	pipes: [TNSFontIconPipe],
	styleUrls:['/app/components/forecast-card.animations.css','/app/components/forecast-card.component.css']
})
export class ForecastCardComponent implements OnInit, AfterContentInit {
	@Input('height') public height: number;
	@Input('top') public top: number;
	@Input('left') public left: number;
	@Input('forecast') public forecast: IForecastCardInfo;
	@Input('state') public state: CardState;

	@ViewChild('card') public card: ElementRef;
	@ViewChild('cardWrapper') public cardWrapper: ElementRef;

	public width: number;

	constructor(private fonticon: TNSFontIconService) {
		this.width = SwissArmyKnife.getScreenHeight().landscape;
	}

	ngOnInit() {
	}
	ngAfterContentInit() {

	}
}