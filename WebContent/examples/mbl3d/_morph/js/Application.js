var Application = function () {
	var scope=this;
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xa0a0a0 );
	
	this.frontPosition=new THREE.Vector3(0, 90, 250);
	this.sidePosition=new THREE.Vector3(250, 90, 0);
	this.zoomPosition=new THREE.Vector3(0, 150, 60);
	
	this.camera = new THREE.PerspectiveCamera( 45, 1, 1, 20000 );//camera resize later
	this.camera.position.copy(this.frontPosition );
	this.camera.name = 'Camera';
	
	//this.camera.updateProjectionMatrix();
	
	var Signal = signals.Signal;
	this.renderer=null;
	
	this.groundMesh=null;
	this.characterRecieveShadow=false;
	
	/* .glb file with morphtarget too large,still I dont know how to working draco to morphtarget.*/
	this.defaultModelUrl="../../../dataset/mbl3d/models/anime2_female.fbx";
	this.modelUrl=this.defaultModelUrl;
	this.skinnedMesh=null;

	//this.defaultTextureUrl="../models/cen_anime_body_derm.png";
	this.defaultTextureUrl="../../../dataset/mbl3d/texture/m_brown.png";
	this.textureUrl=this.defaultTextureUrl;

	
	
	this.hairMesh=null;

	this.morphAnimationIndex=0;
	this.animationTime=1.0
	this.animationDirection=true;
	this.animationMaxValue=1.0;
	
	this.materialType='MeshToonMaterial';
	this.materialWireframe=false;
	
	this.drawOutline=true;
	this.signals = {
			hairModelLoaded: new Signal(),
			windowResize: new Signal(),
			loadingModelStarted:new Signal(),
			loadingModelFinished:new Signal(),
			loadingTextureStarted:new Signal(),
			loadingTextureFinished:new Signal(),
			morphAnimationSelectionChanged:new Signal(),
			morphAnimationStarted:new Signal(),
			morphAnimationFinished:new Signal(),
			materialChanged:new Signal(),
			materialTypeChanged:new Signal(),
			hairMaterialTypeChanged:new Signal()
	}
	
	//tmp TODO texture panel
	this.signals.loadingModelFinished.add (function () {
		scope.skinnedMesh.material.map=scope.texture;
		scope.morphAnimationIndex=0;
	} );
	
	this.signals.loadingTextureStarted.add (function () {
		scope.texture=new THREE.TextureLoader().load(scope.textureUrl);
		scope.texture.flipY = true;//FBX
		scope.texture.minFilter=THREE.LinearFilter;
	} );
	
	this.signals.loadingTextureFinished.add (function () {
		scope.skinnedMesh.material.map=scope.texture;
	} );
	
	this.signals.materialChanged.add (function () {
		scope.skinnedMesh.material.wireframe=scope.materialWireframe;
	} );
	
	
	this.signals.loadingTextureStarted.dispatch();
};


Application.prototype = {
		
}