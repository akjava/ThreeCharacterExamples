var Application = function () {
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xaaaaaa );
	
	this.camera = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
	this.camera.name = 'Camera';
	this.camera.position.set( 0, 5, 10 );
	this.camera.lookAt( new THREE.Vector3() );
	
	

	this.breastBox=null;
	this.breastSize=5;
	this.breastPosX=0;
	this.breastPosY=-2;
	this.breastPosZ=10;
	
	this.damping=1;
	this.stiffness=1000;
	this.meshTransparent=.5;
	this.visibleAmmo=true;
	this.bodyDamping=0.75;
	
	//hard
/*	this.lockX=false;
	this.lockY=false;
	this.lockZ=true;
	
	this.allowAngleX=45;
	this.allowAngleY=15;
	this.allowAngleZ=5;
	this.breastPosZ=10;
	*/
	
	//soft
	/*this.lockX=false;
	this.lockY=false;
	this.lockZ=false;
	
	this.allowAngleX=15;
	this.allowAngleY=15;
	this.allowAngleZ=90;
	this.breastPosZ=10;*/
	
	//more soft
	this.lockX=false;
	this.lockY=false;
	this.lockZ=false;
	
	this.allowAngleX=45;
	this.allowAngleY=30;
	this.allowAngleZ=90;
	this.breastPosZ=6;
	
	this.autoResetPosition=true;
	
	
	var Signal = signals.Signal;

	this.signals = {
			newBreast: new Signal(),
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