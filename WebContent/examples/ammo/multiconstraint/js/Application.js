var Application = function () {
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xaaaaaa );
	
	this.camera = new THREE.PerspectiveCamera( 50, 1, 1, 1000 );
	this.camera.name = 'Camera';
	this.camera.position.set( 0, 90, 160 );
	this.camera.lookAt( new THREE.Vector3() );
	

	
	this.groundRestitution=0.1;
	this.ballRestitution=0.1;
	this.groundFriction=.1;
	this.ballFriction=.1;
	
	this.xForce=0;
	this.yForce=0;
	this.zForce=25;

	this.angularDamping=0;
	this.linearDamping=0;
	
	this.lineLength=5;
	this.ball=null;
	this.ball2=null;
	this.ball3=null;
	this.ball4=null;
	this.ball5=null;
	this.constraint=null;
	this.constraint2=null;
	this.constraint3=null;
	this.constraint4=null;
	this.disableCollisionsBetweenLinkedBodies=false;
	this.frameInA=true;
	this.linearLimitValue=0;
	
	var Signal = signals.Signal;

	this.signals = {
			windowResize: new Signal(),
			rendered:new Signal(),
			ammoSettingUpdated:new Signal()
	}
};


Application.prototype = {
		
}