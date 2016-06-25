import { Injectable } from '@angular/core';
import {StackLayout} from 'ui/layouts/stack-layout';
import { Subject } from 'rxjs/Subject';
import {AnimationCurve, Orientation} from 'ui/enums';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {IForecastCardInfo} from '../components/forecast-card/forecast-card.component';

export enum cardNames {
	morning,
	day,
	evening,
	night
}

export interface ISelectedCard {
	card: AbsoluteLayout;
	cardName: cardNames;
	hideForecast: Function;
	slideforecastIconDownAway?: Function;
	slideforecastIconDownIn?: Function;
	slideforecastIconUpAway?: Function;
	slideforecastIconUpIn?: Function;
	setSelected?: Function;
}

@Injectable()
export class PositioningService {
	public morning: ISelectedCard;
	public day: ISelectedCard;
	public evening: ISelectedCard;
	public night: ISelectedCard;
	public movementDistance: number;
	public selectedCard: Subject<ISelectedCard>;
	public previousCard: ISelectedCard;

	constructor() {

		this.selectedCard = Subject.create();
		this.selectedCard.subscribe((layout: ISelectedCard) => {
			this.morning.setSelected(false);
			this.day.setSelected(false);
			this.evening.setSelected(false);
			this.night.setSelected(false);

			this.hideForecastsExcept(layout.cardName);

			layout.card.animate({
				translate: { x: 0, y: 0 },
				duration: 300,
				curve: AnimationCurve.linear,
			});

			this.handleCardForecastPosistion(layout);
			this.moveWeatherIcon(layout);

			this.previousCard = layout;
		});
	}

	public hideForecastsExcept(timeofDay: cardNames) {
		if (timeofDay !== this.morning.cardName) {
			this.morning.hideForecast();
		}
		if (timeofDay !== this.day.cardName) {
			this.day.hideForecast();
		}
		if (timeofDay !== this.evening.cardName) {
			this.evening.hideForecast();
		}
		if (timeofDay !== this.night.cardName) {
			this.night.hideForecast();
		}
	}

	private handleCardForecastPosistion(layout: ISelectedCard) {
		switch (layout.cardName) {
			case cardNames.morning:
				this.day.card.animate({
					translate: { x: 0, y: this.movementDistance },
					duration: 300,
					curve: AnimationCurve.linear,
				});
			case cardNames.day: case cardNames.morning:
				this.evening.card.animate({
					translate: { x: 0, y: this.movementDistance },
					duration: 300,
					curve: AnimationCurve.linear,
				});
				this.night.card.animate({
					translate: { x: 0, y: this.movementDistance },
					duration: 300,
					curve: AnimationCurve.linear,
				});
			case cardNames.day: case cardNames.morning:
				this.night.card.animate({
					translate: { x: 0, y: this.movementDistance },
					duration: 300,
					curve: AnimationCurve.linear,
				});
				break;
			case cardNames.evening:
				this.day.card.animate({
					translate: { x: 0, y: 0 },
					duration: 300,
				});
				this.night.card.animate({
					translate: { x: 0, y: this.movementDistance },
					duration: 300,
					curve: AnimationCurve.linear,
				});
				break;
			default:
				this.defaultPosition();
		}
	}

	private moveWeatherIcon(currentcard: ISelectedCard) {

		if (this.previousCard != null) {

			if (this.previousCard.cardName === cardNames.morning && currentcard.cardName === cardNames.day) {
				this.previousCard.slideforecastIconDownAway();
				currentcard.slideforecastIconDownIn();
				return;
			}
			if (this.previousCard.cardName === cardNames.day && currentcard.cardName === cardNames.morning) {
				this.previousCard.slideforecastIconUpAway();
				currentcard.slideforecastIconUpIn();
				return;
			}
			//if we get here instead of either of the first two then we slide the icon in and slide it away elsewhere
			if (currentcard.cardName === cardNames.morning) {
				this.previousCard.slideforecastIconDownAway();
				currentcard.slideforecastIconDownIn();
				return;
			}

			if (currentcard.cardName === cardNames.evening && this.previousCard.cardName === cardNames.day) {
				this.previousCard.slideforecastIconDownAway();
				currentcard.slideforecastIconDownIn();
				return;
			}
			if (currentcard.cardName == cardNames.night && this.previousCard.cardName === cardNames.evening) {
				this.previousCard.slideforecastIconDownAway();
				currentcard.slideforecastIconDownIn();
				return;
			}

			if (currentcard.cardName === cardNames.evening && this.previousCard.cardName === cardNames.night) {
				this.previousCard.slideforecastIconUpAway();
				currentcard.slideforecastIconUpIn();
				return;
			}
			if (currentcard.cardName === cardNames.day && this.previousCard.cardName === cardNames.evening) {
				this.previousCard.slideforecastIconUpAway();
				currentcard.slideforecastIconUpIn();
				return;
			}

			if (currentcard.cardName == cardNames.day && (this.previousCard.cardName === cardNames.night)) {
				this.previousCard.slideforecastIconDownAway();
				currentcard.slideforecastIconUpIn();
				return;
			}
			if (currentcard.cardName == cardNames.night && (this.previousCard.cardName === cardNames.day)) {
				this.previousCard.slideforecastIconDownAway();
				currentcard.slideforecastIconUpIn();
				return;
			}
			if (currentcard.cardName == cardNames.night && (this.previousCard.cardName === cardNames.morning)) {
				this.previousCard.slideforecastIconDownAway();
				currentcard.slideforecastIconUpIn();
				return;
			}
			if (currentcard.cardName === cardNames.evening && (this.previousCard.cardName === cardNames.morning)) {
				this.previousCard.slideforecastIconDownAway();
				currentcard.slideforecastIconUpIn();
				return;
			}

		} else {
			console.log('init load');
			currentcard.slideforecastIconUpIn();
		}
	}

	private defaultPosition() {
		this.night.card.animate({
			translate: { x: 0, y: 0 },
			duration: 300,
		});
		this.evening.card.animate({
			translate: { x: 0, y: 0 },
			duration: 300,
		});
		this.night.card.animate({
			translate: { x: 0, y: 0 },
			duration: 300,
		});
		this.day.card.animate({
			translate: { x: 0, y: 0 },
			duration: 300,
		});
	}
}