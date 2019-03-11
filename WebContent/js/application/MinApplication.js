var MinApplication = function () {
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xaaaaaa );
	
	this.camera = new THREE.PerspectiveCamera( 50, 1, .1, 1000 );
	this.camera.name = 'Camera';
	this.camera.position.set( 0, 5, 10 );
	this.camera.lookAt( new THREE.Vector3() );
	
	var Signal = signals.Signal;

	this.signals = {
			loadingModelStarted:new Signal(),
			loadingModelFinished:new Signal(),
			windowResize: new Signal(),
			rendered:new Signal(),
	}
	
	AppUtils.decoderPath="../../libs/draco/gltf/";
};

MinApplication.prototype.getSignal=function(key){
	var signal= this.signals[key];
	if(signal==undefined){
		signal=new signals.Signal();
		this.signals[key]=signal;
	}
	return signal;
}