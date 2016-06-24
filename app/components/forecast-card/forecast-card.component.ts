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
		<AbsoluteLayout [class]="forecast?.timeOfDay" (touch)="cardTapEvent($event)" #card class="card" [width]="width" borderRadius="0" [height]="height * 4" [left]="left" [top]="top"  >
			<Label top="11" #forecastIcon left="40" [class]="'wi ' +  forecast?.timeOfDay + '-icon'" [text]="forecast?.icon | fonticon"></Label>
			<StackLayout top="20" left="200" >
				<Label class="time" [text]="forecast?.timeOfDay"></Label>
				<Label [text]="forecast?.temperatureDiff + '\u00B0'" class="info-text degrees" textWrap="true"></Label>
				<StackLayout #forecastInfo class="forecast">
					<Label [text]="forecast?.summary" class="info-text summary" textWrap="true"></Label>
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
	public width: number;
	private rippling: boolean;
	private forecastContainer: StackLayout;
	private selected: boolean;
	private upDistance: number;
	private downDistance: number;

	constructor(private fonticon: TNSFontIconService, private positioning: PositioningService) {
		this.width = SwissArmyKnife.getScreenHeight().landscape;
		this.rippling = false;
		this.downDistance = 250;
		this.upDistance = -250;
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		let icon = <Label>this.forecastIcon.nativeElement;
		let forecast = <StackLayout>this.forecastInfo.nativeElement;
		let card = <StackLayout>this.card.nativeElement;
		icon.translateY = this.downDistance;
		if (this.forecast != null) {
			this.positioning[this.forecast.timeOfDay.toLowerCase()] = {
				card: this.card.nativeElement,
				cardName: cardNames[this.forecast.timeOfDay.toLowerCase()],
				hideCard: this.hideForecast.bind(this),
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
				hideCard: this.hideForecast,
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
		let icon = <Label>this.forecastIcon.nativeElement;
		forecast.animate({
			translate: { x: 0, y: 0 },
			duration: 300,
			curve: AnimationCurve.easeIn,
			delay: 200,
		}).then(() => {
			forecast.translateY = 0; //sets the ending position to 0 as to prevent ios from reverting
		});
		//icon.visibility = 'visible';

	}
	public hideForecast() {
		let forecast = <StackLayout>this.forecastInfo.nativeElement;
		let icon = <Label>this.forecastIcon.nativeElement;

		if (this.forecast.timeOfDay.toLowerCase() === 'night') {
			forecast.animate({
				translate: { x: 0, y: 150 },
				duration: 300,
				curve: AnimationCurve.easeIn,
			});
		} else {
			setTimeout(() => {
				forecast.translateY = this.downDistance;
			}, 0);
		}
		//
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
			console.log('finished position');
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