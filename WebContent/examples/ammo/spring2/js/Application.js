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
	
	this.linearLimitX=5;
	this.linearLimitY=5;
	this.linearLimitZ=5;
	
	
	this.angularLimitX=1.58;
	this.angularLimitY=1.58;
	this.angularLimitZ=1.58;
	
	this.ball=null;
	this.ball2=null;
	this.constraint=null;
	this.disableCollisionsBetweenLinkedBodies=false;
	this.frameInA=true;
	
	this.linearXEnabled=true;
	this.linearYEnabled=true;
	this.linearZEnabled=true;
	this.linearXDamping=1;
	this.linearYDamping=1;
	this.linearZDamping=1;
	this.linearXStiffness=100;
	this.linearYStiffness=100;
	this.linearZStiffness=100;
	
	this.angularXEnabled=true;
	this.angularYEnabled=true;
	this.angularZEnabled=true;
	this.angularXDamping=1;
	this.angularYDamping=1;
	this.angularZDamping=1;
	this.angularXStiffness=100;
	this.angularYStiffness=100;
	this.angularZStiffness=100;
	
	this.ballMass=1;
	this.setBreakingImpulseThreshold=false;
	this.breakingImpulseThreshold=3.5;

	this.posYDirection=true;
	
	var Signal = signals.Signal;

	this.signals = {
			windowResize: new Signal(),
			rendered:new Signal(),
			ammoSettingUpdated:new Signal()
	}
};


Application.prototype = {
		
}