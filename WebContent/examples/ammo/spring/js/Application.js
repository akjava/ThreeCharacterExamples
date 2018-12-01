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
	this.zForce=0;

	this.angularDamping=0;
	this.linearDamping=0;
	
	this.lineLength=5;
	this.ball=null;
	this.ball2=null;
	this.constraint=null;
	this.disableCollisionsBetweenLinkedBodies=false;
	this.frameInA=true;
	this.damping=1;
	this.stiffness=100;
	
	this.posYDirection=true;

	this.linearLimitValue=1;
	
	var Signal = signals.Signal;

	this.signals = {
			windowResize: new Signal(),
			rendered:new Signal(),
			ammoSettingUpdated:new Signal()
	}
};


Application.prototype = {
		
}