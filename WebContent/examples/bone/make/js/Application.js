var Application = function () {
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xaaaaaa );
	
	this.camera = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
	this.camera.name = 'Camera';
	this.camera.position.set( 0, -5, 30 );
	
	
	var Signal = signals.Signal;

	this.signals = {
			windowResize: new Signal(),
			rendered:new Signal(),
			boneAnimationStarted:new Signal(),
			boneAnimationFinished:new Signal(),
			skinnedMeshChanged:new Signal(),
	}
	

	
};


Application.prototype = {
		
}