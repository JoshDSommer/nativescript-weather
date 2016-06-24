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
		this.requestURl = `https://api.forecast.io/forecast/7d4358a03f4e8309fcc754a0e1cc3613/[lat],[lng],${this.currentDate.getFullYear()}-0${this.currentDate.getMonth() + 1}-${this.currentDate.getDate()}T00:00:01`;
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
		let forecast: IForecast = <any>{};
		let body = res.json();
		let currentTemp = Math.floor(body.currently.temperature);
		//console.log(extractForecastCardInfo(body.hourly.data[5], 'morning',  body.currently.temperature));
		console.log(currentTemp);
		console.log('------------------------');
		console.log(res);
		forecast.temperature = Math.floor(body.currently.temperature);
		forecast.location = 'Canton Ohio';
		forecast.morning = {
			timeOfDay: 'morning',
			icon: 'wi-forecast-io-' + body.hourly.data[5].icon,
			temperature: body.hourly.data[5].temperature,
			temperatureDiff: Math.floor(body.hourly.data[5].temperature - currentTemp),
			windSpeed: body.hourly.data[5].windSpeed,
			windBearing: body.hourly.data[5].windBearing,
			summary: body.hourly.data[5].summary,
			humidity: body.hourly.data[5].humidity
		};
		forecast.day = {
			timeOfDay: 'day',
			icon: 'wi-forecast-io-' + body.hourly.data[11].icon,
			temperature: body.hourly.data[11].temperature,
			temperatureDiff: Math.floor(body.hourly.data[11].temperature - currentTemp),
			windSpeed: body.hourly.data[11].windSpeed,
			windBearing: body.hourly.data[11].windBearing,
			summary: body.hourly.data[11].summary,
			humidity: body.hourly.data[11].humidity
		};
		forecast.evening = {
			timeOfDay: 'evening',
			icon: 'wi-forecast-io-' + body.hourly.data[15].icon,
			temperature: body.hourly.data[15].temperature,
			temperatureDiff: Math.floor(body.hourly.data[15].temperature - currentTemp),
			windSpeed: body.hourly.data[15].windSpeed,
			windBearing: body.hourly.data[15].windBearing,
			summary: body.hourly.data[15].summary,
			humidity: body.hourly.data[15].humidity
		};
		forecast.night = {
			timeOfDay: 'night',
			icon: 'wi-forecast-io-' + body.hourly.data[19].icon,
			temperature: body.hourly.data[19].temperature,
			temperatureDiff: Math.floor(body.hourly.data[19].temperature - currentTemp),
			windSpeed: body.hourly.data[19].windSpeed,
			windBearing: body.hourly.data[19].windBearing,
			summary: body.hourly.data[19].summary,
			humidity: body.hourly.data[19].humidity
		};
		//extractForecastCardInfo(body.hourly.data[5], 'morning', 0);
		// forecast.day = extractForecastCardInfo(body.hourly.data[11], 'day',  0);
		// forecast.evening = extractForecastCardInfo(body.hourly.data[15], 'evening',  0);
		// forecast.night = extractForecastCardInfo(body.hourly.data[19], 'night', 0);
		return forecast;
	}

	extractForecastCardInfo(data: any, timeofDay: string, currentTemp: number): IForecastCardInfo {
		let forecastInfo: IForecastCardInfo;
		console.log(JSON.stringify(data));
		forecastInfo = {
			timeOfDay: timeofDay,
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