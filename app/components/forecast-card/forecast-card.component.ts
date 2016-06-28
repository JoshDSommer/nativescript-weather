import { Component, ViewEncapsulation, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import {SwissArmyKnife} from 'nativescript-swiss-army-knife/nativescript-swiss-army-knife';
import {TNSFontIconService, TNSFontIconPipe} from 'nativescript-ng2-fonticon';
import {IForecastCardInfo} from '../../services/forecast.io.services';
import {Label} from 'ui/label';
import {StackLayout} from 'ui/layouts/stack-layout';
import * as gestures from 'ui/gestures';
import {PositioningService, cardNames } from '../../services/positioning.service';
import { Subject } from 'rxjs/Subject';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {Color} from 'color';
import {AnimationCurve, Orientation} from 'ui/enums';
import * as Platform from 'platform';
const themes = require('nativescript-themes');

export enum CardState {
	hidden = 0,
	visible = 1
}

export interface IForecastCardInfo extends AbsoluteLayout {
	showForecast();
	hideForecast();
}


@Component({
	selector: 'forecast-card',
	template: `
		<AbsoluteLayout [class]="forecast?.timeOfDay + ' card'" (touch)="cardTapEvent($event)" #card width="100%" [height]="height * 3" [left]="left" [top]="top"  >
			<Label top="11" #forecastIcon left="40" [class]="'wi ' +  forecast?.timeOfDay + '-icon'" [text]="forecast?.icon | fonticon"></Label>
			<StackLayout top="20" left="200" [height]="height * 2" >
				<Label class="time" [text]="forecast?.day"></Label>
				<Label [text]="forecast?.temperature + '\u00B0'" class="degrees" textWrap="true"></Label>
				<StackLayout #forecastInfo [height]="height * 2" class="forecast">
					<Label [text]="forecast?.summary" class="info-text summary"  textWrap="true"></Label>
					<Label [text]="'Wind: ' + forecast?.windBearing + ' ' + forecast?.windSpeed + ' mph'" class="info-text wind" textWrap="true"></Label>
					<Label [text]="'Humidity: ' + forecast?.humidity + '%'" class="info-text humidity" textWrap="true"></Label>
				</StackLayout>
			</StackLayout>
		</AbsoluteLayout>
	`,
	pipes: [TNSFontIconPipe]
})
export class ForecastCardComponent implements OnInit, AfterViewInit {
	@Input('height') public height: number;
	@Input('top') public top: number;
	@Input('left') public left: number;
	@Input('forecast') public forecast: IForecastCardInfo;
	@Input('state') public state: CardState;

	@ViewChild('card') public card: ElementRef;
	@ViewChild('forecastIcon') public forecastIcon: ElementRef;
	@ViewChild('forecastInfo') public forecastInfo: ElementRef;
	private rippling: boolean;
	private forecastContainer: StackLayout;
	public selected: boolean;
	private upDistance: number;
	private downDistance: number;

	constructor(private fonticon: TNSFontIconService, private positioning: PositioningService) {
		this.rippling = false;
		this.downDistance = 250;
		this.upDistance = -250;
		this.selected = false;
	}

	ngOnInit() {
		const screen = Platform.screen;
		const scale = screen.mainScreen.widthDIPs;

		if (scale >= 600) {
			themes.applyTheme('app.minWH600.css');
		} else if (scale >= 400) {
			themes.applyTheme('app.minWH480.css');
		} else if (scale >= 320) {
			themes.applyTheme('app.minWH320.css');
		} else {
			themes.applyTheme('app.minWHdefault.css');
		}

	}

	ngAfterViewInit() {
		let icon = <Label>this.forecastIcon.nativeElement;
		icon.translateY = this.downDistance;
		if (this.forecast != null) {
			this.positioning[this.forecast.timeOfDay.toLowerCase()] = {
				card: this.card.nativeElement,
				cardName: cardNames[this.forecast.timeOfDay.toLowerCase()],
				hideForecast: this.hideForecast.bind(this),
				slideforecastIconDownAway: this.slideforecastIconDownAway.bind(this),
				slideforecastIconDownIn: this.slideforecastIconDownIn.bind(this),
				slideforecastIconUpAway: this.slideforecastIconUpAway.bind(this),
				slideforecastIconUpIn: this.slideforecastIconUpIn.bind(this),
				setSelected: this.setSelected.bind(this)
			};
			this.hideForecast();
		}

	}

	setSelected(value: boolean) {
		this.selected = value;
	}

	selectCard(): void {
		this.state === CardState.visible;

		this.positioning.selectedCard.next(
			{
				card: this.card.nativeElement,
				cardName: cardNames[this.forecast.timeOfDay.toLowerCase()],
				hideForecast: this.hideForecast,
				slideforecastIconDownAway: this.slideforecastIconDownAway.bind(this),
				slideforecastIconDownIn: this.slideforecastIconDownIn.bind(this),
				slideforecastIconUpAway: this.slideforecastIconUpAway.bind(this),
				slideforecastIconUpIn: this.slideforecastIconUpIn.bind(this),
				setSelected: null,
			});
		this.showForecast();
		this.selected = true;
	}

	cardTapEvent(e: gestures.TouchGestureEventData) {
		if (e && e.action === 'down' && this.rippling === false && !this.selected) {
			this.selectCard();
			this.createRipple(<AbsoluteLayout>e.object, e.getX(), e.getY());
		}
	}

	private createRipple(layout: AbsoluteLayout, x: number, y: number) {
		let ripple = new Label;
		this.rippling = true;

		ripple.height = 80;
		ripple.width = 80;
		ripple.borderRadius = 500;
		ripple.backgroundColor = new Color('#fff');
		ripple.opacity = 0.09;
		layout.addChild(ripple);

		y = y - 50;
		x = x - 50;
		AbsoluteLayout.setTop(ripple, y);
		AbsoluteLayout.setLeft(ripple, x);

		ripple.animate({
			scale: { x: 20, y: 20 },
			duration: 500
		}).then(() => {
			ripple.animate({
				scale: { x: 0, y: 0 },
				duration: 1
			}).then(() => {
				layout.removeChild(ripple);
				this.rippling = false;
			});
		});
	}

	public showForecast() {
		let forecast = <StackLayout>this.forecastInfo.nativeElement;
		let previousCard = this.positioning.previousCard;
		forecast.animate({
			translate: { x: 0, y: 0 },
			duration: 300,
			curve: AnimationCurve.easeIn,
			delay: 400,
		}).then(() => {
			if (previousCard != null)
				previousCard.hideForecast();
			forecast.translateY = 0; //sets the ending position to 0 as to prevent ios from reverting
		});
		//icon.visibility = 'visible';

	}
	public hideForecast() {
		let forecast = <StackLayout>this.forecastInfo.nativeElement;
		let icon = <Label>this.forecastIcon.nativeElement;


		forecast.animate({
			translate: { x: 0, y: 150 },
			duration: 400,
			curve: AnimationCurve.easeIn,
		});

		//}
	}

	public slideforecastIconDownAway(): void {
		let icon = <Label>this.forecastIcon.nativeElement;
		icon.translateY = 0; //start in the original position

		icon.animate({
			translate: { x: 0, y: this.downDistance },
			curve: AnimationCurve.linear,
			duration: 400
		}).then(() => {
			return icon.translateY = this.downDistance;
		}).catch(() => {
			return icon.translateY = 0;
		});
	}
	public slideforecastIconUpAway(): void {
		let icon = <Label>this.forecastIcon.nativeElement;
		icon.translateY = 0; //start in the original position
		icon.animate({
			translate: { x: 0, y: this.upDistance },
			curve: AnimationCurve.linear,
			duration: 400
		}).then(() => {
			return icon.translateY = this.upDistance;
		}).catch(() => {
			return icon.translateY = this.upDistance;
		});
	}

	public slideforecastIconDownIn(): void {
		let icon = <Label>this.forecastIcon.nativeElement;
		icon.translateY = this.upDistance; //start in the original position
		icon.animate({
			translate: { x: 0, y: 0 },
			curve: AnimationCurve.linear,
			duration: 300
		}).then(() => {
			return icon.translateY = 0;
		}).catch(() => {
			return icon.translateY = 0;
		});
	}
	public slideforecastIconUpIn(): void {
		let icon = <Label>this.forecastIcon.nativeElement;
		icon.translateY = this.downDistance; //start in the original position
		icon.animate({
			translate: { x: 0, y: 0 },
			curve: AnimationCurve.linear,
			duration: 400
		}).then(() => {
			return icon.translateY = 0;
		}).catch(() => {
			return icon.translateY = 0;
		});
	}
}