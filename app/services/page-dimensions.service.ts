import { Injectable } from '@angular/core';
import {SwissArmyKnife} from 'nativescript-swiss-army-knife/nativescript-swiss-army-knife';
import {Observable} from 'rxjs/observable';
import * as Rx from 'rxjs/Rx';

export interface IDimensions {
	cardSize: number;
	cardRowSize: number;
	pageHeight: number;
	morningOffset: number;
	dayOffset: number;
	eveningOffset: number;
	nightOffset: number;
	maxYScroll: number;
}

@Injectable()
export class PageDimensions {

	constructor() { }

	//right now this is probably overkill
	getDimensions(): Rx.Observable<IDimensions> {
		const portraitHeight = SwissArmyKnife.getScreenHeight().portrait - 80;
		const cardRowSize = portraitHeight / 5;
		const cardSize = cardRowSize * 4 - 16;

		return Rx.Observable.of<IDimensions>({
			cardRowSize: cardRowSize,
			cardSize: cardSize,
			pageHeight: portraitHeight,
			morningOffset: 0,
			dayOffset: cardRowSize,
			eveningOffset: cardRowSize * 2,
			nightOffset: cardRowSize * 3,
			maxYScroll: cardRowSize * 2
		});
	}
}