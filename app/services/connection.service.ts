import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs/Rx';
import { RouterExtensions } from 'nativescript-angular/router'

import { connectionType as ConnectionType, getConnectionType, startMonitoring, stopMonitoring } from 'connectivity'


/*
export enum ConnectionType {
	mobile = connectionType.mobile,
	wifi = connectionType.wifi,
	none = connectionType.none,
}
*/

@Injectable()
export class ConnectivityService {

	private currentConnectionType: BehaviorSubject<ConnectionType>;

	constructor(private router: RouterExtensions) {
		this.currentConnectionType = new BehaviorSubject<ConnectionType>(getConnectionType());
	}

	getConnectionType(): ConnectionType {
		return getConnectionType();
	}

	startMonitoring(callback: { (connectionType: ConnectionType) }) {
		return startMonitoring(callback);
	}

	stopMonitoring() {
		return stopMonitoring();
	}

	checkConnection() {
		var connection: ConnectionType = this.getConnectionType();
		console.log('checkConnecton', connection)
		if (connection == ConnectionType.none) {
			this.router.navigate(['/network'], { clearHistory: true });
		}
	}
}