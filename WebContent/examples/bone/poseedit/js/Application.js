var Application = function () {
	this.objects=[];
	
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xaaaaaa );
	
	this.camera = new THREE.PerspectiveCamera( 50, 1, 0.01, 2000 );
	this.camera.name = 'Camera';
	this.camera.position.set( 0, 5, 10 );
	this.camera.lookAt( new THREE.Vector3() );
	
	this.visibleOriginBone=true;
	this.visibleBone=false;
	this.visibleSkeletonHelper=false;
	
	this.ikControler=new IkControler(undefined,this);
	
	var Signal = signals.Signal;

	this.signals = {
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