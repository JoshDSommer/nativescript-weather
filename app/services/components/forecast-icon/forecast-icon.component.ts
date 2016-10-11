import { Component, OnInit, Input  } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'icon',
	template: `
		<StackLayout ngSwitch="icon">
			<StackLayout>

			</StackLayout>
		</StackLayout>
	`,
	styles:[`


	`]
})
export class ComponentNameComponent implements OnInit {
	@Input() icon: string;

	constructor() { }

	ngOnInit() { }

}