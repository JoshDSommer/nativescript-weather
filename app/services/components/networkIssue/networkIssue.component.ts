import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'network-issue',
	template:`
		<StackLayout [visibility]="isErrorVisible ? 'visible' : 'collapse'" >
			<Label class="sad-face" text=":(" textWrap="true"></Label>
			<Label class="error-text" text="Error connecting to forecast service" textWrap="true"></Label>
		</StackLayout>
	`,
	styleUrls: ['theme-natural.css', 'app.css'],

})
export class NetworkIssueComponent implements OnInit {
	constructor() { }

	ngOnInit() { }


}