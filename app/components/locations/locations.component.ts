import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SwissArmyKnife, IScreenHeight} from 'nativescript-swiss-army-knife/nativescript-swiss-army-knife';
import {ILocationInfo, LocationService } from '../../services/location.service';
import { ActivityIndicator } from 'ui/activity-indicator';
import {StackLayout} from 'ui/layouts/stack-layout';
import {TNSFontIconService, TNSFontIconPipe} from 'nativescript-ng2-fonticon';
import {AnimationCurve, Orientation, KeyboardType} from 'ui/enums';
import {Label} from 'ui/label';
import * as gestures from 'ui/gestures';
import {Router} from '@angular/router';
import {topmost} from 'ui/frame';
import {Page} from 'ui/page';
import {View} from 'ui/core/view';
import {Color} from 'color';
import {TextField} from 'ui/text-field';

@Component({
	selector: 'locations-component',
	template: `
		<ActionBar title="Set Your Location" class="action-bar">
			<!-- <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" tap="onNavBtnTap"></NavigationButton> -->
		</ActionBar>
		<StackLayout #locationCard class="evening">
			<Label text="Enter your postal code" textWrap="true" class="header"></Label>

			<TextField #postalCode hint="Postal Code" class="postal-code" text=""></TextField>
			<Label text="Lookup" class="morning lookupButton" (touch)="lookUpPostalCode($event)" textWrap="true"></Label>

			<Label #result text="" class="result" textWrap="true"></Label>
			<Label #saveButton text="Save this location?" class="morning lookupButton" (touch)="saveLocation($event)" textWrap="true"></Label>

		</StackLayout>
		`,
	styleUrls: ['theme-natural.css'],
	pipes: [TNSFontIconPipe],
	styles: [`

		.evening{
			border-radius:15;
			height:60%;
			width:80%;
			margin:0 10% 10% 10%;
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
			height:45;
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
		.postal-code{
			margin:10 0;
			color:#fff;
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
		// page.actionBarHidden = true;
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
		} else if (e.action === 'down') {
			(<Label>e.object).opacity = 0.5;
		}

	}

	saveLocation(e: gestures.TouchGestureEventData) {
		if (e.action === 'up') {
			console.log('lookup clicked');
			(<Label>e.object).opacity = 1;
			this.locationService.saveLocation(this.location);
			this.router.navigate(['']);

		} else if (e.action === 'down') {
			(<Label>e.object).opacity = 0.5;
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

	ngOnInit() {
		let page = <Page>topmost().currentPage;
		// page.actionBarHidden = true;
		console.log('init ' + JSON.stringify(page));

	}


	ngAfterViewInit() {

		console.log('lookup loaded');
		let postalCodeTxt = (<TextField>this.postalCodeTxt.nativeElement);
		this.saveButton.nativeElement.opacity = 0;
		this.resultTxt.nativeElement.opacity = 0;

		let white = new Color('#fff');

		(<android.widget.EditText>postalCodeTxt.android).setHintTextColor(white.android);

		postalCodeTxt.keyboardType = KeyboardType.number;

		this.location = this.locationService.getStoredLocations();
		if (this.location != null) {
			// this.router.navigate(['Forecast']);
			this.displayLocation(this.location);
		}

		this.locationCard.nativeElement.translateY = this.pageDimensions.portrait;

		// this setTimeout should not be needed ?!?
		setTimeout(() => {
			this.locationCard.nativeElement.animate({
				duration: 1500,
				translate: { x: 0, y: 0 },
				curve: AnimationCurve.easeOut
			});
		}, 0);
	}
}