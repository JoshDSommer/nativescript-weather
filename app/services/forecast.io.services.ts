import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/observable';
import * as Rx from 'rxjs/Rx';
import * as applicationSettings from 'application-settings';
///https://api.forecast.io/forecast/7d4358a03f4e8309fcc754a0e1cc3613/40.7989,-81.3784,2016-05-22T00:00:01
/// last portion is the current date starting at the begining. so we can get hourly for cast for the day.
/// morning 6am. index 5
/// day noon index 11
/// evening 5 index 15
/// night 10...index 19

//const mockData = require('mock-forecast-data.json');
export interface IForecast {
	location: string;
	temperature: number;
	morning: IForecastCardInfo;
	day: IForecastCardInfo;
	evening: IForecastCardInfo;
	night: IForecastCardInfo;
}

export interface IForecastCardInfo {
	summary: string;
	icon: string;//: partly-cloudy-night,
	temperature: number;
	temperatureDiff: number;
	windSpeed: number;
	windBearing: string;
	timeOfDay: string;
	day: string;
	humidity: number;
}

/// font icons can be made by prefixing  with  'wi-forecast-io-'
interface IForecastData {
	time: number;
	summary: string;
	icon: string;//: partly-cloudy-night,
	precipIntensity: number;
	precipProbability: number;
	temperature: number;
	apparentTemperature: number;
	dewPoint: number;
	humidity: number;
	windSpeed: number;
	windBearing: number;
	visibility: number;
	cloudCover: number;
	pressure: number;
	ozone: number;
}


@Injectable()
export class ForecastIOService {
	private currentDate = new Date();
	private requestURl: string;
	constructor(private http: Http) {
		this.requestURl = `https://api.forecast.io/forecast/7d4358a03f4e8309fcc754a0e1cc3613/[lat],[lng]`; // ,${this.currentDate.getFullYear()}-0${this.currentDate.getMonth() + 1}-${this.currentDate.getDate()}T00:00:01`;
		console.log(this.requestURl);
	}

	getForecast(lat: string, lng: string): Observable<IForecast> {
		//	let data = applicationSettings.getString(`${this.currentDate.getFullYear()}-0${this.currentDate.getMonth() + 1}-${this.currentDate.getDate()}`);
		//	if (data == null) {
		let forecastURL = this.requestURl.replace('[lat]', lat).replace('[lng]', lng);
		console.log(forecastURL);
		return this.http.get(forecastURL).map(this.extractData);
		//	}
	}



	private extractData(res: Response): IForecast {
		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		let forecast: IForecast = <any>{};
		let body = res.json();
		let currentTemp = Math.floor(body.currently.temperature);
		let windBearing = (windBearing: number): string => {
			if (windBearing < 45) {
				return 'N';
			}
			if (windBearing < 120) {
				return 'E';
			}
			if (windBearing < 225) {
				return 'S';
			}
			if (windBearing < 315) {
				return 'W';
			}
			return 'N';
		};

		//console.log(extractForecastCardInfo(daily[0], 'morning',  body.currently.temperature));
		console.log(currentTemp);
		console.log('------------------------');
		forecast.temperature = Math.floor(body.currently.temperature);
		forecast.location = 'Canton Ohio';

		let daily = body.daily.data;
		console.log(windBearing(daily[3].windBearing))

		forecast.morning = {
			timeOfDay: 'morning',
			day: 'today',
			icon: 'wi-forecast-io-' + daily[0].icon,
			temperature: Math.floor(daily[0].temperatureMax),
			temperatureDiff: Math.floor(daily[0].temperatureMax - currentTemp),
			windSpeed: Math.floor(daily[0].windSpeed),
			windBearing: windBearing(daily[0].windBearing),
			summary: daily[0].summary,
			humidity: daily[0].humidity
		};
		forecast.day = {
			timeOfDay: 'day',
			day: 'tomorrow',
			icon: 'wi-forecast-io-' + daily[1].icon,
			temperature: Math.floor(daily[1].temperatureMax),
			temperatureDiff: Math.floor(daily[1].temperatureMax - currentTemp),
			windSpeed: Math.floor(daily[1].windSpeed),
			windBearing: windBearing(daily[1].windBearing),
			summary: daily[1].summary,
			humidity: daily[1].humidity
		};
		forecast.evening = {
			timeOfDay: 'evening',
			day: days[new Date(daily[2].time * 1000).getUTCDay()],
			icon: 'wi-forecast-io-' + daily[2].icon,
			temperature: Math.floor(daily[2].temperatureMax),
			temperatureDiff: Math.floor(daily[2].temperatureMax - currentTemp),
			windSpeed: Math.floor(daily[2].windSpeed),
			windBearing: windBearing(daily[2].windBearing),
			summary: daily[2].summary,
			humidity: daily[2].humidity
		};
		forecast.night = {
			timeOfDay: 'night',
			day: days[new Date(daily[3].time * 1000).getUTCDay()],
			icon: 'wi-forecast-io-' + daily[3].icon,
			temperature: Math.floor(daily[3].temperatureMax),
			temperatureDiff: Math.floor(daily[3].temperatureMax - currentTemp),
			windSpeed: Math.floor(daily[3].windSpeed),
			windBearing: windBearing(daily[3].windBearing),
			summary: daily[3].summary,
			humidity: daily[3].humidity
		};

		// forecast.morning = {
		// 			timeOfDay: 'morning',
		// 			icon: 'wi-forecast-io-' + daily[0].icon,
		// 			temperature: daily[0].temperature,
		// 			temperatureDiff: Math.floor(daily[0].temperature - currentTemp),
		// 			windSpeed: daily[0].windSpeed,
		// 			windBearing: daily[0].windBearing,
		// 			summary: daily[0].summary,
		// 			humidity: daily[0].humidity
		// 		};
		// 		forecast.day = {
		// 			timeOfDay: 'day',
		// 			icon: 'wi-forecast-io-' + daily[1].icon,
		// 			temperature: daily[1].temperature,
		// 			temperatureDiff: Math.floor(daily[1].temperature - currentTemp),
		// 			windSpeed: daily[1].windSpeed,
		// 			windBearing: daily[1].windBearing,
		// 			summary: daily[1].summary,
		// 			humidity: daily[1].humidity
		// 		};
		// 		forecast.evening = {
		// 			timeOfDay: 'evening',
		// 			icon: 'wi-forecast-io-' + daily[2].icon,
		// 			temperature: daily[2].temperature,
		// 			temperatureDiff: Math.floor(daily[2].temperature - currentTemp),
		// 			windSpeed: daily[2].windSpeed,
		// 			windBearing: daily[2].windBearing,
		// 			summary: daily[2].summary,
		// 			humidity: daily[2].humidity
		// 		};
		// 		forecast.night = {
		// 			timeOfDay: 'night',
		// 			icon: 'wi-forecast-io-' + daily[3].icon,
		// 			temperature: daily[3].temperature,
		// 			temperatureDiff: Math.floor(daily[3].temperature - currentTemp),
		// 			windSpeed: daily[3].windSpeed,
		// 			windBearing: daily[3].windBearing,
		// 			summary: daily[3].summary,
		// 			humidity: daily[3].humidity
		// 		};

		//extractForecastCardInfo(daily[0], 'morning', 0);
		// forecast.day = extractForecastCardInfo(daily[1], 'day',  0);
		// forecast.evening = extractForecastCardInfo(daily[2], 'evening',  0);
		// forecast.night = extractForecastCardInfo(daily[3], 'night', 0);
		return forecast;
	}

	extractForecastCardInfo(data: any, timeofDay: string, currentTemp: number): IForecastCardInfo {
		let forecastInfo: IForecastCardInfo;
		console.log(JSON.stringify(data));
		forecastInfo = {
			timeOfDay: timeofDay,
			day: '',
			icon: 'wi-forecast-io-' + data.icon,
			temperature: data.temperature,
			temperatureDiff: 0,
			windSpeed: data.windSpeed,
			windBearing: data.windBearing,
			summary: data.summary,
			humidity: data.humidity
		};

		return forecastInfo;
	}

	windBearing(windBearing: number): string {
		if (windBearing < 45) {
			return 'N';
		}
		if (windBearing < 120) {
			return 'E';
		}
		if (windBearing < 225) {
			return 'S';
		}
		if (windBearing < 315) {
			return 'W';
		}
		return 'N';
	}

}