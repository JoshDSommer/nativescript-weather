import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectivityService, ConnectionType } from '../../services';
import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router'

@Component({
	selector: 'network-issue',
	template: `
		<ActionBar title="Weather Cards" class="action-bar"></ActionBar>
		<StackLayout>
			<Label class="sad-face" text=":(" textWrap="true"></Label>
			<Label class="error-text" text="Error connecting to forecast service" textWrap="true"></Label>
		</StackLayout>
	`,
	styleUrls: ['theme-natural.css', 'app.css'],

})
export class NetworkIssueComponent implements OnInit, OnDestroy {
	constructor(private router: RouterExtensions, private conntectivityService: ConnectivityService) {

	}

	ngOnInit() {

	}

	ngOnDestroy() {
	}

}