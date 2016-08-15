// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {nativeScriptBootstrap } from "nativescript-angular/application";
import {provide} from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import {WeatherAppComponent, APP_ROUTES} from './app.component';

import {TNSFontIconService, TNSFontIconPipe} from 'nativescript-ng2-fonticon';

///// HACK - fix dom adapter
import {Parse5DomAdapter} from '@angular/platform-server/src/parse5_adapter';
(<any>Parse5DomAdapter).prototype.getCookie = function (name) { return null; };
///// HACK - fix dom adapter


nativeScriptBootstrap(WeatherAppComponent, [HTTP_PROVIDERS, APP_ROUTES,
	provide(TNSFontIconService, {
		useFactory: () => {
			return new TNSFontIconService({
				'wi': 'weather-icons.css',
				'fa': 'font-awesome.css'
			}, false);
		}
	})
]);
