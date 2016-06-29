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
import {TextField} from 'ui/text-field';
import * as app from 'application';
import {Color} from 'color';
import * as Platform from 'platform';
import * as Dialogs from 'ui/dialogs';
import * as applicationSettings from 'application-settings';

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
			<StackLayout #celsiusWrap orientation="horizontal" class="celsius-wrap">
				<Label text="Celsius" class="celsius" textWrap="true"></Label>
				<Switch #celsiusSwitch horizontalAlignment="right" ></Switch>
			</StackLayout>
			<Label #saveButton text="Save this location?" class="morning lookupButton save-button" (touch)="saveLocation($event)" textWrap="true"></Label>

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
		.celsius-wrap{
			margin:8 20%;
			width:60%;
			padding:0 5;

		}
		.celsius{
			color:#fff;
			text-align:left;
			font-size:20;
			width:70%;
		}
		.postal-code{
			margin:10 0;
			color:#fff;
			text-align:center;
			font-size:20;
		}
		.save-button{
			height:45;
		}
	`],
})
export class LocationsComponent {
	@ViewChild('postalCode') postalCodeTxt: ElementRef;
	@ViewChild('result') resultTxt: ElementRef;
	@ViewChild('locationCard') locationCard: ElementRef;
	@ViewChild('saveButton') saveButton: ElementRef;
	@ViewChild('celsiusSwitch') celsiusSwitch: ElementRef;
	@ViewChild('celsiusWrap') celsiusWrap: ElementRef;

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
	}

	lookUpPostalCode(e: gestures.TouchGestureEventData) {
		if (e.action === 'up') {
			(<Label>e.object).opacity = 1;
			let postalCode: string = this.postalCodeTxt.nativeElement.text;

			if (postalCode == null || postalCode == '') {
				Dialogs.alert({
					title: 'Oops',
					message: 'You need to enter a postal code',
					okButtonText: 'Try something else'
				}).then();
				return;
			}
			this.postalCodeTxt.nativeElement.dismissSoftInput();
			this.locationService.getLocationInfo(postalCode).subscribe((value: ILocationInfo) => {
				if (value.name === 'none') {
					Dialogs.alert({
						title: 'Oops',
						message: 'No locations found with the postal code ' + postalCode,
						okButtonText: 'Try something else'
					}).then(function () {
						this.postalCodeTxt.nativeElement.text = '';
						this.saveButton.nativeElement.opacity = 0;
						this.celsiusWrap.nativeElement.visibility = 'collapse';
					});
				} else {
					this.displayLocation(value);
					this.celsiusWrap.nativeElement.visibility = 'visible';
					(<Label>this.saveButton.nativeElement).animate(
						{
							opacity: 1,
							duration: 400,
						}
					);
				}

			});
		} else if (e.action === 'down') {
			(<Label>e.object).opacity = 0.5;
		}

	}

	saveLocation(e: gestures.TouchGestureEventData) {
		if (e.action === 'up') {
			(<Label>e.object).opacity = 1;
			this.locationService.saveLocation(this.location);
			this.router.navigate(['']);
			applicationSettings.setBoolean('celsius', this.celsiusSwitch.nativeElement.checked);
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
		let postalCodeTxt = (<TextField>this.postalCodeTxt.nativeElement);
		postalCodeTxt.android.setHintTextColor(android.graphics.Color.parseColor('#FFFFFF'));
	}


	ngAfterViewInit() {
		this.celsiusSwitch.nativeElement.checked = false;

		let postalCodeTxt = (<TextField>this.postalCodeTxt.nativeElement);
		this.resultTxt.nativeElement.opacity = 0;
		this.saveButton.nativeElement.opacity = 0;
		this.celsiusWrap.nativeElement.visibility = 'collapse';

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
				duration: 1800,
				translate: { x: 0, y: 0 },
				curve: AnimationCurve.easeOut
			});
		}, 0);
	}
}