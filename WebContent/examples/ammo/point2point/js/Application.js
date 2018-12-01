var Application = function () {
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xaaaaaa );
	
	this.camera = new THREE.PerspectiveCamera( 50, 1, 1, 1000 );
	this.camera.name = 'Camera';
	this.camera.position.set( 0, 90, 160 );
	this.camera.lookAt( new THREE.Vector3() );
	
	this.xForce=0;
	this.yForce=0;
	this.zForce=25;

	this.angularDamping=0.1;
	this.linearDamping=0.1;
	
	this.lineLength=5;
	this.ball=null;
	this.constraint=null;
	
	var Signal = signals.Signal;

	this.signals = {
			windowResize: new Signal(),
			rendered:new Signal(),
			ammoSettingUpdated:new Signal()
	}
};


Application.prototype = {
		
}