var Application = function () {
	this.objects=[];
	
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xaaaaaa );
	
	this.camera = new THREE.PerspectiveCamera( 50, 1, 1, 2000 );
	this.camera.name = 'Camera';
	this.camera.position.set( 0, 5, 10 );
	this.camera.lookAt( new THREE.Vector3() );
	
	this.visibleOriginBone=true;
	this.visibleBone=false;
	this.visibleSkeletonHelper=false;
	
	this.ikControler=new IkControler(undefined,this);
	
	this.cameraY=125;
	this.targetY=60;
	this.cameraZ=280;
	
	
	this.defaultTextureUrl="../../../dataset/mbl3d/texture/m_brown.png";
	this.textureUrl=this.defaultTextureUrl;
	
	this.timelinerClipExportName="clip_timeliner_bones";
	var Signal = signals.Signal;

	this.signals = {
			skinnedMeshTransformeFinished:new Signal(),
			boneTranslateFinished:new Signal(),
			boneRotationFinished:new Signal(),
			skinnedMeshTransformed:new Signal(),
			ikSelectionChanged:new Signal(),
			loadingTextureStarted:new Signal(),
			loadingTextureFinished:new Signal(),
			ikInitialized:new Signal(),
			solveIkCalled:new Signal(),
			boneSelectionChanged:new Signal(),//bone selection changed by selector or click
			boneRotationChanged:new Signal(),//called from tf-control for notice rotation editor
			boneTranslateChanged:new Signal(),
			transformChanged:new Signal(),//tf-control
			transformSelectionChanged:new Signal(),//tf-control selection
			poseChanged:new Signal(),//called when pose loaded
			windowResize: new Signal(),
			rendered:new Signal(),
			skinnedMeshChanged:new Signal(),//when skinnedMesh Loaded
	}
	

	
};


Application.prototype = {
		
}