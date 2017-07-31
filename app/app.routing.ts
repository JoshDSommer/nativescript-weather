import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import {
    ForecastCardComponent,
    ForecastComponent,
    LocationsComponent,
    NetworkIssueComponent
} from './components';


const routes: Routes = [
    { path: "", component: ForecastComponent },
    { path: "location", component: LocationsComponent },
    { path: "network", component: NetworkIssueComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }