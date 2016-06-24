// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {nativeScriptBootstrap } from "nativescript-angular/application";
import {provide} from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import {WeatherAppComponent} from './app.component';
// import {APP_ROUTER_PROVIDERS} from './app.routes';

import {TNSFontIconService, TNSFontIconPipe} from 'nativescript-ng2-fonticon';

nativeScriptBootstrap(WeatherAppComponent, [HTTP_PROVIDERS,
	provide(TNSFontIconService, {
		useFactory: () => {
			return new TNSFontIconService({
				'wi': 'weather-icons.css',
				'fa': 'font-awesome.css'
			}, false);
		}
	})
]);
// nativeScriptBootstrap(WeatherAppComponent, [HTTP_PROVIDERS, APP_ROUTER_PROVIDERS,
// 	provide(TNSFontIconService, {
// 		useFactory: () => {
// 			return new TNSFontIconService({
// 				'wi': 'weather-icons.css',
// 				'fa': 'font-awesome.css'
// 			}, false);
// 		}
// 	})
// ]);