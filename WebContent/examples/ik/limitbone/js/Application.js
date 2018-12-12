var Application = function () {
	this.objects=[];
	
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xaaaaaa );
	
	this.camera = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
	this.camera.name = 'Camera';
	this.camera.position.set( 0, 5, 10 );
	this.camera.lookAt( new THREE.Vector3() );
	
	this.visibleOriginBone=true;
	this.visibleBone=false;
	this.visibleSkeletonHelper=false;
	
	this.maxAngle=1;
	this.iteration=25;
	
	this.ikLockX=false;
	this.ikLockY=false;
	this.ikLockZ=false;
	
	this.boneSelectedIndex=0;
	this.boneLocked={};
	
	var Signal = signals.Signal;
	
	this.ikDefaultLimitMin={};
	this.ikDefaultLimitMax={};
	
	this.ikBoneSelectedOnly=false;
	this.ikLimitkRotationEnabled=true;

	this.signals = {
			boneLimitLoaded:new Signal(),
			boneLimitChanged:new Signal(),
			boneSelectionChanged:new Signal(),
			poseChanged:new Signal(),
			solveIkCalled:new Signal(),
			
			transformChanged:new Signal(),
			transformSelectionChanged:new Signal(),
			
			windowResize: new Signal(),
			rendered:new Signal(),
			objectRotate:new Signal(),
			boneAnimationStarted:new Signal(),
			boneAnimationFinished:new Signal(),
			skinnedMeshChanged:new Signal(),
			boxVisibleChanged:new Signal(),
			boneAnimationIndexChanged:new Signal(),
			
	}
	

	
};


Application.prototype = {
		
}