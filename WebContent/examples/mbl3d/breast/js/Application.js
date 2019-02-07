var Application = function () {
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xaaaaaa );
	
	this.camera = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
	this.camera.name = 'Camera';
	this.camera.position.set( 0, 5, 10 );
	this.camera.lookAt( new THREE.Vector3() );
	
	
	this.damping=100;
	this.stiffness=1000;
	this.meshTransparent=0.5;
	this.bothBreast=false;
	this.visibleAmmo=true;
	this.bodyDamping=0.1;
	var Signal = signals.Signal;

	this.signals = {
			skinnedMeshTransformed: new Signal(),
			windowResize: new Signal(),
			rendered:new Signal(),
			skinnedMeshChanged:new Signal(),
			boneAnimationFinished:new Signal(),
			boneAnimationStarted:new Signal(),
			boneAnimationIndexChanged:new Signal(),
			visibleAmmoChanged:new Signal(),
			meshTransparentChanged:new Signal(),
			springChanged:new Signal(),
			
	}
	

	
};


Application.prototype = {
		
}