import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {SwissArmyKnife} from 'nativescript-swiss-army-knife/nativescript-swiss-army-knife';
import {Observable} from 'rxjs/observable';
import * as applicationSettings from 'application-settings';
import * as geolocation from 'nativescript-geolocation';

export interface ILocationInfo {
	name: string;
	lat: string;
	lng: string;
	zip: string;
	default: boolean;
}

@Injectable()
export class LocationService {
	private current: ILocationInfo;

	constructor(private http: Http) {
		this.current = <any>{};
	}

	getLogLat(): Promise<ILocationInfo> {
		return geolocation.getCurrentLocation((value: geolocation.Location) => {
			this.current.lat = value.latitude.toString();
			this.current.lng = value.longitude.toString();
		}).then(() => this.current);
	}

	getStoredLocations(): ILocationInfo {
		let locationJSON = applicationSettings.getString('locations');
		if (locationJSON == null) {
			return null;
		}

		let location: ILocationInfo = JSON.parse(locationJSON);
		if (location == null) {
			return null;
		}
		return location;
	}

	saveLocation(location: ILocationInfo): void {
		applicationSettings.setString('locations', JSON.stringify(location));
	}

	removeSavedLocatoin(): void {
		//todo;
	}

	getCityName(): Observable<string> {
		if (this.current.lat == null) {
			this.getLogLat().then();
		}
		let googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.current.lat},${this.current.lng}&sensor=true`;
		return this.http.get(googleApiUrl).map(this.extractCityName);
	}

	getLocationInfo(zip: string): Observable<ILocationInfo> {
		let googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=&components=postal_code:${zip}&sensor=false`;
		console.log(googleApiUrl);

		return this.http.get(googleApiUrl).map(this.extractData);
	}

	extractCityName(value: any): string {
		let result = value._body.result[0];

		let address_components: any[] = (<any[]>result.address_components);
		console.log(JSON.stringify(address_components));
		let state = address_components.filter((value: any) => {
			return (<any[]>value.types).indexOf('administrative_area_level_1') > -1;
		})[0];

		return state;
		// return (<any[]>result.address_components).map((value: any, index: number) => {
		// 	if ((<any[]>value.types).indexOf('locality') >= 0) {
		// 		return value.long_name;
		// 	}
		// })[0] + ' ' + .map((value: any, index: number) => {
		// 	if ((<any[]>value.types).indexOf('administrative_area_level_1') >= 0) {
		// 		return value.short_name;
		// 	}
		// })[0];
	}

	extractData(value: any): ILocationInfo {
		let result = value._body.results[0];
		//let cityName = this.extractCityName(value);

		return <ILocationInfo>{
			name: result.formatted_address.replace(', USA', ''),
			lat: result.geometry.bounds.northeast.lat,
			lng: result.geometry.bounds.northeast.lng,
			zip: '',
			default: false
		};
	}

}