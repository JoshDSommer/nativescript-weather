import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SwissArmyKnife, IScreenHeight} from 'nativescript-swiss-army-knife/nativescript-swiss-army-knife';
import {ILocationInfo, LocationService } from '../../services/location.service';
import { ActivityIndicator } from 'ui/activity-indicator';
import {StackLayout} from 'ui/layouts/stack-layout';
import {AnimationCurve, Orientation} from 'ui/enums';
import {Label} from 'ui/label';
import * as gestures from 'ui/gestures';
import {Router} from '@angular/router-deprecated';
import {topmost} from 'ui/frame';
import {Page} from 'ui/page';

@Component({
	selector: 'locations-component',
	template: `
		<StackLayout #locationCard class="evening">
			<Label text="Enter your postal code" textWrap="true" class="header"></Label>

			<TextField #postalCode hint="Postal Code" text=""></TextField>
			<Label text="Lookup" class="morning lookupButton" (touch)="lookUpPostalCode($event)" textWrap="true"></Label>

			<Label #result text="" class="result" textWrap="true"></Label>
			<Label #saveButton text="Save this location?" class="morning lookupButton" (touch)="saveLocation($event)" textWrap="true"></Label>

		</StackLayout>
		`,
	styleUrls: ['theme-natural.css'],
	styles: [`

		.evening{
			border-radius:15;
			height:60%;
			width:80%;
			margin:5% 10% 10% 10%;
			padding:5px 15px;
		}
		.evening Label, .evening TextField{
			color:#fff;
		}
		.header{
			text-transform:uppercase;
			padding-top:5;
			font-size:18;

		}
		.lookupButton{
			border-radius:15;
			margin:5 20%;
			width:60%;
			height:30;
			text-align:center;
			color:#fff;
			opacity:0.8;
			font-weight:bold;
			text-transform:uppercase;
			letter-spacing:.5;
			padding:5 25 5;
		}

		.result{
			margin-top:20%;
			text-transform:uppercase;
			font-size:20;
			text-align:center;
		}

	`],
})
export class LocationsComponent {
	@ViewChild('postalCode') postalCodeTxt: ElementRef;
	@ViewChild('result') resultTxt: ElementRef;
	@ViewChild('locationCard') locationCard: ElementRef;
	@ViewChild('saveButton') saveButton: ElementRef;

	public location: ILocationInfo;
	public leftOffset: number;
	public topOffset: number;
	public height: number;
	private pageDimensions: IScreenHeight;

	constructor(private router: Router, private locationService: LocationService) {
		let page = <Page>topmost().currentPage;
		page.actionBarHidden = true;
		this.pageDimensions = SwissArmyKnife.getScreenHeight();
		this.leftOffset = SwissArmyKnife.getScreenHeight().landscape / 2;
		this.height = (this.pageDimensions.portrait - this.pageDimensions.androidStatusBar - this.pageDimensions.androidNavBar) / 1.75;
		this.topOffset = this.height;
		console.log(this.height);
		// this.locations = this.locationService.getStoredLocations();

	}

	lookUpPostalCode(e: gestures.TouchGestureEventData) {
		if (e.action === 'up') {
			console.log('lookup clicked');
			(<Label>e.object).opacity = 1;

		} else if (e.action === 'down') {
			(<Label>e.object).opacity = 0.5;
		}

		let postalCode: string = this.postalCodeTxt.nativeElement.text;
		this.locationService.getLocationInfo(postalCode).subscribe((value: ILocationInfo) => {
			console.log(JSON.stringify(value));
			this.displayLocation(value);
			(<Label>this.saveButton.nativeElement).animate(
				{
					opacity: 1,
					duration: 400,
				}
			);
		});
	}

	saveLocation(e: gestures.TouchGestureEventData) {
		if (e.action === 'up') {
			console.log('lookup clicked');
			this.locationService.saveLocation(this.location);
			this.router.navigate(['Forecast']);
		}
	}


	displayLocation(location: ILocationInfo): void {
		this.resultTxt.nativeElement.text = location.name;
		this.location = location;
		this.resultTxt.nativeElement.animate(
			{
				opacity: 1,
				duration: 400,
			}
		);
	}

	ngAfterViewInit() {
		let page = <Page>topmost().currentPage;
		page.actionBarHidden = true;
		console.log('lookup loaded');

		this.saveButton.nativeElement.opacity = 0;
		this.resultTxt.nativeElement.opacity = 0;

		this.location = this.locationService.getStoredLocations();
		if (this.location != null) {
			// this.router.navigate(['Forecast']);
			this.displayLocation(this.location);
		}

		this.locationCard.nativeElement.translateY = this.pageDimensions.portrait;
		this.locationCard.nativeElement.animate({
			duration: 2000,
			translate: { x: 0, y: 0 },
			curve: AnimationCurve.easeOut
		});
	}
}