import {Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, NgZone  } from '@angular/core';
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


@Component({
	selector: 'locations-component',
	template: `
		<ActionBar title="Set Your Location" class="action-bar">
			<!-- <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" tap="onNavBtnTap"></NavigationButton> -->
		</ActionBar>
		<DockLayout #locationCard class="location-card" [height]="height" [width]="width">
			<Label dock="top" text="Enter your postal code " textWrap="true" class="header"></Label>

			<TextField dock="top" #postalCode hint="Postal Code and Country" class="postal-code" text=""></TextField>
			<Label dock="top" text="Lookup" class="morning lookupButton" (touch)="lookUpPostalCode($event)" textWrap="true"></Label>

			<StackLayout dock="bottom" >
				<Label #result [text]="location.name" class="result" textWrap="true"></Label>
				<GridLayout #celsiusWrap rows="*" columns="75,*" class="celsius-wrap">
					<Label row="0" col="0" text="Celsius" class="celsius" textWrap="true"></Label>
					<Switch  row="0" col="1" #celsiusSwitch horizontalAlignment="right" ></Switch>
				</GridLayout>
				<Label #saveButton text="Save this location?" class="morning lookupButton save-button" (touch)="saveLocation($event)" textWrap="true"></Label>
			</StackLayout>


		</DockLayout>
		`,
	styleUrls: ['theme-natural.css', 'components/locations/locations.component.css'],
	pipes: [TNSFontIconPipe],
})
export class LocationsComponent {
	@ViewChild('postalCode') postalCodeTxt: ElementRef;
	@ViewChild('result') resultTxt: ElementRef;
	@ViewChild('locationCard') locationCard: ElementRef;
	@ViewChild('saveButton') saveButton: ElementRef;
	@ViewChild('celsiusSwitch') celsiusSwitch: ElementRef;
	@ViewChild('celsiusWrap') celsiusWrap: ElementRef;

	public location: ILocationInfo;
	public locationsSubscription: Subscription;
	public leftOffset: number;
	public topOffset: number;
	public height: number;
	public width: number;
	private pageDimensions: IScreenHeight;

	constructor(private router: Router, private locationService: LocationService, private ref: ChangeDetectorRef) {
		let page = <Page>topmost().currentPage;
		// page.actionBarHidden = true;
		this.pageDimensions = SwissArmyKnife.getScreenHeight();
		this.leftOffset = SwissArmyKnife.getScreenHeight().landscape / 2;
		this.height = (this.pageDimensions.portrait - this.pageDimensions.androidStatusBar - this.pageDimensions.androidNavBar) / 1.75;
		this.topOffset = this.height;

		this.width = ((this.pageDimensions.landscape / 5) * 4);
		this.height = ((this.pageDimensions.portrait / 5) * 2.5);


	}

	lookUpPostalCode(e: gestures.TouchGestureEventData) {
		if (e.action === 'up') {
			(<Label>e.object).opacity = 1;

			let postalCode: string = this.postalCodeTxt.nativeElement.text.trim();
			if (postalCode == null || postalCode === '') {
				Dialogs.alert({
					title: 'Oops',
					message: 'You need to enter a postal code',
					okButtonText: 'Try something else'
				}).then();
				return;
			}

			this.postalCodeTxt.nativeElement.dismissSoftInput();

			this.locationsSubscription = this.locationService.getLocationInfo(postalCode).subscribe((values: ILocationInfo[]) => {
				let value = values[0];
				this.ref.detectChanges();

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
		let page = <Page>topmost().currentPage;
		// page.actionBarHidden = true;
		// SwissArmyKnife.actionBarHideBackButton();
		//this.locations$ = new Observable<ILocationInfo[]>().startWith
	}

	ngOnDestroyed(): void {
		this.locationsSubscription.unsubscribe();
	}


	ngAfterViewInit() {
		this.celsiusSwitch.nativeElement.checked = false;

		let postalCodeTxt = (<TextField>this.postalCodeTxt.nativeElement);
		this.resultTxt.nativeElement.opacity = 0;
		this.saveButton.nativeElement.opacity = 0;
		this.celsiusWrap.nativeElement.visibility = 'collapse';

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
				duration: 1800,
				translate: { x: 0, y: 0 },
				curve: AnimationCurve.easeOut
			});
		}, 0);

	}
}