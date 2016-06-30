import {SwissArmyKnife} from 'nativescript-swiss-army-knife/nativescript-swiss-army-knife';


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

		SwissArmyKnife.setAndroidNavBarColor('#644749');
		SwissArmyKnife.setAndroidStatusBarColor('#8ba192');
		configSplash.setLogoSplash(org.joshdsommer.weathercards.R.drawable.splash_logo); //or any other drawable

		configSplash.setTitleSplash('');
	}
	animationsFinished() {
		const intent = new android.content.Intent(com.tns.NativeScriptApplication.getInstance().getApplicationContext(), com.tns.NativeScriptActivity.class)
		intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
		com.tns.NativeScriptApplication.getInstance().startActivity(intent);
		SwissArmyKnife.setAndroidNavBarColor('#644749');
		SwissArmyKnife.setAndroidStatusBarColor('#8ba192');
	}
};