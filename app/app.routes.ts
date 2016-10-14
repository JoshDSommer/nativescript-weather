import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { NativeScriptRouterModule } from 'nativescript-angular/router'
import { ForecastCardComponent, ForecastComponent, LocationsComponent, NetworkIssueComponent } from './components';


var routes: Routes = [
	{ path: "", component: ForecastComponent },
	{ path: "location", component: LocationsComponent },
	{ path: "network", component: NetworkIssueComponent },
];


export let providedRoutes = NativeScriptRouterModule.forRoot(routes);