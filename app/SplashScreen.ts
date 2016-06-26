import * as app from 'application';
import {Color} from 'color';
import * as Platform from 'platform';

@JavaProxy("co.fitcom.SplashScreen")
export class SplashScreen extends com.viksaa.sssplash.lib.activity.AwesomeSplash {
	protected onCreate(bundle) {
		super.onCreate(bundle);
	}

	initSplash(configSplash) {
		//Customize Circular Reveal
		configSplash.setBackgroundColor(org.joshdsommer.weathercards.R.color.custom_green);//new Color('#8ba892').android); //any color you want form colors.xml
		configSplash.setAnimCircularRevealDuration(1000); //int ms
		configSplash.setRevealFlagX(com.viksaa.sssplash.lib.cnst.Flags.REVEAL_RIGHT);  //or Flags.REVEAL_LEFT
		configSplash.setRevealFlagY(com.viksaa.sssplash.lib.cnst.Flags.REVEAL_BOTTOM); //or Flags.REVEAL_TOP

		if (app.android && Platform.device.sdkVersion >= '19') {
			let window = app.android.startActivity.getWindow();
			window.setStatusBarColor(new Color('#8ba192').android);
			window.setNavigationBarColor(new Color('#644749').android);
		}
		//Choose LOGO OR PATH; if you don't provide String value for path it's logo by default

		//Customize Logo
		configSplash.setLogoSplash(org.joshdsommer.weathercards.R.drawable.splash_logo); //or any other drawable
		//configSplash.setAnimLogoSplashDuration(1500); //int ms
		//configSplash.setAnimLogoSplashTechnique(com.daimajia.androidanimations.library.Techniques.Bounce); //choose one form Techniques (ref: https://github.com/daimajia/AndroidViewAnimations)

		configSplash.setTitleSplash('');
	}
	animationsFinished() {
		const intent = new android.content.Intent(com.tns.NativeScriptApplication.getInstance().getApplicationContext(), com.tns.NativeScriptActivity.class)
		intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
		com.tns.NativeScriptApplication.getInstance().startActivity(intent);
		if (app.android && Platform.device.sdkVersion >= '19') {
			let window = app.android.startActivity.getWindow();
			window.setStatusBarColor(new Color('#8ba192').android);
			window.setNavigationBarColor(new Color('#644749').android);
		}
	}
};