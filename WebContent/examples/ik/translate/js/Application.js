var Application = function () {
	this.scene = new THREE.Scene();
	this.objects=[];
	
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xaaaaaa );
	
	this.camera = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
	this.camera.name = 'Camera';
	this.camera.position.set( 0, 5, 10 );
	this.camera.lookAt( new THREE.Vector3() );
	
	this.randomSize=10;
	this.minDistance=3;
	this.maxDistance=5;
	this.jointCount=5;
	this.limitAngle=1;
	this.iteration=10;
	
	
	var Signal = signals.Signal;
	this.signals = {
			transformChanged:new Signal(),
			selectionChanged:new Signal(),
			ikTargetSelected: new Signal(),
			ikTargetCreated: new Signal(),
			ikCreated: new Signal(),
			windowResize: new Signal(),
			rendered:new Signal(),
	}
	
	
	
	

	
};


Application.prototype = {
		
}