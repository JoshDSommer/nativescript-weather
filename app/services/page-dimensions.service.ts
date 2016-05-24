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
}

@Injectable()
export class PageDimensions {

	constructor() { }

	//right now this is probably overkill
	getDimensions(): Rx.Observable<IDimensions> {
		const portraitHeight = SwissArmyKnife.getScreenHeight().portrait;
		const cardRowSize = portraitHeight / 6;
		const cardSize = cardRowSize * 4;

		console.log(`row :${cardRowSize}`);

		return Rx.Observable.of<IDimensions>({
			cardRowSize: cardRowSize,
			cardSize: cardSize,
			pageHeight: portraitHeight,
			morningOffset: -cardRowSize,
			dayOffset: 0,
			eveningOffset: cardRowSize,
			nightOffset: cardRowSize * 2,
		});
	}
}