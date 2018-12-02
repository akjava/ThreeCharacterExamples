var Application = function () {
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xaaaaaa );
	
	this.camera = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
	this.camera.name = 'Camera';
	this.camera.position.set( 0, 5, 10 );
	this.camera.lookAt( new THREE.Vector3() );
	
	
	this.translateClipDuration=0;
	this.scaleClipDuration=0;
	this.morphClipDuration=0;
	this.rotateClipDuration=0;
	
	this.enableScaleAnimation=true;
	this.enableMorphAnimation=true;
	this.enableTranslateAnimation=true;
	
	this.useScaleRandomSameValue=true;
	this.scaleType="simple";
	
	this.scale=1.02;
	this.scaleDuration=0.25;
	this.breastScaleEnabled=false;
	this.thighScaleEnabled=false;
	this.upperarmScaleEnabled=true;
	
	this.minScale=1.01;
	this.maxScale=1.02;
	this.randomScaleCount=10;
	this.randomScaleContinue=4;
	this.randomScaleDuration=0.15;
	
	this.nostrisExpansionMin=1;
	this.nostrisExpansionMax=1;
	this.nostrisExpansionInTime=1.0;
	this.nostrisExpansionOutTime=1.0;
	this.nostrisExpansionEnabled=true;
	this.mouthInflatedExpansionMin=0.5;
	this.mouthInflatedExpansionMax=0.1;
	this.mouthInflatedExpansionInTime=1.0;
	this.mouthInflatedExpansionOutTime=1.0;
	this.mouthInflatedExpansionEnabled=true;
	this.deglutitionExpansionMin=1;
	this.deglutitionExpansionMax=1;
	this.deglutitionExpansionInTime=1.0;
	this.deglutitionExpansionOutTime=1.0;
	this.deglutitionExpansionEnabled=true;
	this.chestExpansionMin=1;
	this.chestExpansionMax=1;
	this.chestExpansionInTime=1.0;
	this.chestExpansionOutTime=1.0;
	this.chestExpansionEnabled=true;
	this.abdomExpansionMin=1;
	this.abdomExpansionMax=1;
	this.abdomExpansionInTime=1.0;
	this.abdomExpansionOutTime=1.0;
	this.abdomExpansionEnabled=true;

	
	this.thighTranslateEnabled=true;
	
	this.breastTranslateVertical=-.001;
	this.breastTranslateHorizontal=.001;
	this.breastTranslateEnabled=false;
	this.breastTranslateIntime=0.5;
	this.breastTranslateOuttime=0.5;
	
	this.enableRotateAnimation=true;
	this.breastRotateEnabled=true;
	this.breastRotateOuttime=0.2;
	this.breastRotateIntime=0.2;
	
	var Signal = signals.Signal;

	this.signals = {
			windowResize: new Signal(),
			rendered:new Signal(),
			animationStarted:new Signal(),
			animationStopped:new Signal(),
			
			morphAnimationStarted:new Signal(),
			scaleAnimationStarted:new Signal(),
			translateAnimationStarted:new Signal(),
			rotateAnimationStarted:new Signal(),
			
			loadingModelFinished:new Signal(),
	}
	

	
};


Application.prototype = {
		
}