var Application = function () {
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xaaaaaa );
	
	this.camera = new THREE.PerspectiveCamera( 50, 1, 1, 1000 );
	this.camera.name = 'Camera';
	this.camera.position.set( 0, 5, 10 );
	this.camera.lookAt( new THREE.Vector3() );
	
	

	this.breastBox=null;

	
	
	this.meshTransparent=.5;
	this.visibleAmmo=true;

	
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

	
	this.breastControler=new BreastControler();
	
	var Signal = signals.Signal;

	this.signals = {
			loadingTextureStarted:new Signal(),
			loadingTextureFinished:new Signal(),
			loadingModelStarted:new Signal(),
			loadingModelFinished:new Signal(),
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