// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {nativeScriptBootstrap } from "nativescript-angular/application";
import {provide} from '@angular/core';
import {WeatherAppComponent} from './app.component';

import {TNSFontIconService, TNSFontIconPipe} from 'nativescript-ng2-fonticon';

nativeScriptBootstrap(WeatherAppComponent, [
	provide(TNSFontIconService, {
		useFactory: () => {
			return new TNSFontIconService({
				'wi': 'weather-icons.css'
			}, false);
		}
	})
]);