import {Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy  } from '@angular/core';
import {Location as ngLocation}  from '@angular/common';
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
import {Observable} from 'rxjs/observable';
import {Subscription} from 'rxjs/subscription';
import * as app from 'application';
import {Color} from 'color';
import * as Platform from 'platform';
import * as Dialogs from 'ui/dialogs';
import * as applicationSettings from 'application-settings';
declare var zonedCallback: Function;

@Component({
	selector: 'locations-component',
	template: `
		<ActionBar title="Set Your Location" class="action-bar">
			<!-- <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" tap="onNavBtnTap"></NavigationButton> -->
		</ActionBar>
		<StackLayout>
			<Label  text="Search for your postal code and country" textWrap="true" class="header"></Label>

			<TextField  #postalCode hint="Search" class="postal-code" text=""></TextField>
			<Button text="Lookup" class="night lookupButton" (tap)="lookUpPostalCode()"></Button>

			<StackLayout  [visibility]="isResultsVisible ? 'visible' : 'collapse'" >
				<Label #result [text]="location?.name" class="result" textWrap="true"></Label>
				<GridLayout #celsiusWrap rows="*" columns="75,*" class="celsius-wrap">
					<Label row="0" col="0" text="Celsius" class="celsius" textWrap="true"></Label>
					<Switch  row="0" col="1" #celsiusSwitch horizontalAlignment="right" ></Switch>
				</GridLayout>
				<Button text="Save this location?" class="night lookupButton save-button" (tap)="saveLocation()"></Button>
			</StackLayout>
		</StackLayout>

		`,
	styleUrls: ['theme-natural.css', 'components/locations/locations.component.css'],
	pipes: [TNSFontIconPipe],
})
export class LocationsComponent {
	@ViewChild('postalCode') postalCodeTxt: ElementRef;
	@ViewChild('result') resultTxt: ElementRef;
	@ViewChild('locationCard') locationCard: ElementRef;
	@ViewChild('celsiusSwitch') celsiusSwitch: ElementRef;

	public isResultsVisible: boolean;
	public location: ILocationInfo;
	public locationsSubscription: Subscription;
	public leftOffset: number;
	private pageDimensions: IScreenHeight;

	constructor(private router: Router, private locationService: LocationService, private ref: ChangeDetectorRef, private ngLocation: ngLocation) {
		this.pageDimensions = SwissArmyKnife.getScreenHeight();
		this.leftOffset = SwissArmyKnife.getScreenHeight().landscape / 2;
		this.isResultsVisible = false;
		this.location = <any>{
			name: ''
		};
	}


	lookUpPostalCode() {
		let postalCode: string = this.postalCodeTxt.nativeElement.text.trim();
		if (postalCode == null || postalCode === '') {
			Dialogs.alert({
				title: 'Oops',
				message: 'You need to enter a postal code',
				okButtonText: 'Try something else'
			}).then();

			this.isResultsVisible = false;
			this.ref.detectChanges();
		} else {
			this.postalCodeTxt.nativeElement.dismissSoftInput();

			this.locationsSubscription = this.locationService.getLocationInfo(postalCode).subscribe((values: ILocationInfo[]) => {
				this.isResultsVisible = true;
				this.ref.detectChanges();
				let value = values[0];
				if (!value || value.name === 'none') {
					Dialogs.alert({
						title: 'Oops',
						message: 'No locations found with the postal code ' + postalCode,
						okButtonText: 'Try something else'
					}).then(function () {
						this.postalCodeTxt.nativeElement.text = '';
					});
				} else {
					this.displayLocation(value);
				}
			});
		}
	}

	saveLocation() {
		this.locationService.saveLocation(this.location);
		applicationSettings.setBoolean('celsius', this.celsiusSwitch.nativeElement.checked);
		this.isResultsVisible = false;
		this.ref.detectChanges();
		this.router.navigate(['']);
		//this.ngLocation.back();
	}


	displayLocation(location: ILocationInfo): void {

		this.resultTxt.nativeElement.text = location.name;
		this.location = location;
		this.isResultsVisible = true;
	}

	ngOnInit() {
		let page = <Page>topmost().currentPage;
	}

	ngOnDestroyed(): void {
		this.locationsSubscription.unsubscribe();
	}


	ngAfterViewInit() {
		this.celsiusSwitch.nativeElement.checked = false;

		let postalCodeTxt = (<TextField>this.postalCodeTxt.nativeElement);


		if (app.android) {
			let white = new Color('#fff');
			postalCodeTxt.android.setHintTextColor(white.android);
		}

		this.location = this.locationService.getStoredLocations();

		if (this.location != null) {
			this.displayLocation(this.location);
		}

	}
}