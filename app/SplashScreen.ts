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

		//Customize Logo
		configSplash.setLogoSplash(org.joshdsommer.weathercards.R.drawable.splash_logo); //or any other drawable
		//configSplash.setAnimLogoSplashTechnique(com.daimajia.androidanimations.library.Techniques.Bounce); //choose one form Techniques (ref: https://github.com/daimajia/AndroidViewAnimations)

		configSplash.setTitleSplash('');
	}
	animationsFinished() {
		const intent = new android.content.Intent(com.tns.NativeScriptApplication.getInstance().getApplicationContext(), com.tns.NativeScriptActivity.class)
		intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
		com.tns.NativeScriptApplication.getInstance().startActivity(intent);
	}
};