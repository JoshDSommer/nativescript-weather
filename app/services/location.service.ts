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

	getLocationInfoTriniwiz(zip: string): Observable<ILocationInfo> {
		let apiUrl = `https://api.fitcom.co/weatherecipes/api/location/postalcode?code=${zip}`;
		console.log(apiUrl);
		return this.http.get(apiUrl).map(response => response.json()).map(this.extractDataLocation);
	}

	extractDataLocation(value: any): ILocationInfo {
		let result = value;
		console.log(result);
		return <ILocationInfo>{
			name: result.address.city + ' ' + result.address.state,
			lat: result.lat,
			lng: result.lon,
			zip: '',
			default: false
		};
	}

	getLocationInfo(zip: string): Observable<ILocationInfo[]> {
		let safeZip = encodeURIComponent(zip);
		let googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=&components=postal_code:${safeZip}&sensor=false`;
		return this.http.get(googleApiUrl).map(this.extractData);
	}

	extractCityName(value: any): string {
		let result = value._body.result[0];

		let address_components: any[] = (<any[]>result.address_components);
		let state = address_components.filter((value: any) => {
			return (<any[]>value.types).indexOf('administrative_area_level_1') > -1;
		})[0];

		return state;
	}

	extractData(value: any): ILocationInfo[] {
		let result: any[] = value._body.results;

		let returnValue = result.map(result => {
			if (result == null) {
				return <ILocationInfo>{
					name: 'none',
					lat: '',
					lng: '',
					zip: '',
					default: false
				};
			}

			return <ILocationInfo>{
				name: result.formatted_address.replace(', USA', ''),
				lat: result.geometry.bounds.northeast.lat,
				lng: result.geometry.bounds.northeast.lng,
				zip: '',
				default: false
			};
		});
		return returnValue;
	}

}