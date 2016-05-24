import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/observable';
import * as Rx from 'rxjs/Rx';
///https://api.forecast.io/forecast/7d4358a03f4e8309fcc754a0e1cc3613/40.7989,-81.3784,2016-05-22T00:00:01
/// last portion is the current date starting at the begining. so we can get hourly for cast for the day.
/// morning 6am. index 5
/// day noon index 11
/// evening 5 index 15
/// night 10...index 19
export const morningCardColor = '#e3bb88';
export const dayCardColor = '#d89864';
export const eveningCardColor = '#b1695a';
export const nightCardColor = '#644749';

const mockData = require('mock-forecast-data.json');
export interface IForecast{
	location: string;
	temperature: number;
	cards: IForecastCardInfo[];
}

export interface IForecastCardInfo {
	summary: string;
	icon: string;//: partly-cloudy-night,
	iconColor: string;
	temperature: number;
	temperatureDiff: number;
	windSpeed: number;
	windBearing: string;
	timeOfDay: string;
	bgColor: string;
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



function windBearing(windBearing: number) {
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

