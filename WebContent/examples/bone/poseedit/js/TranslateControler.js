var TranslateControler=function(ap,boneAttachControler){
	var scope=this;
	this.ap=ap;
	this.boneAttachControler=boneAttachControler;
	this.translateControls={};
	//TODO support non-root bones
}
//so far only root support
TranslateControler.prototype.initialize=function(){
	var scope=this;
	var ap=this.ap;
	var root=scope.boneAttachControler.containerList[0];
	var sphere=new THREE.Mesh(new THREE.SphereGeometry(2),new THREE.MeshBasicMaterial({color:0x000088,depthTest:false,transparent:true,opacity:.5}));
	sphere.renderOrder=1;
	sphere.position.copy(root.position);
	ap.scene.add(sphere);
	sphere.userData.boneIndex=0;
	sphere.userData.transformSelectionType="BoneTranslate";
	ap.objects.push(sphere);
	
	this.translateControls["root"]=sphere;
	
	function resetPosition(){
		scope.boneAttachControler.update();
		sphere.position.copy(root.position);
	}
	
	function onBoneTranslateChanged(){
		resetPosition();
		
	}
	scope.onBoneTranslateChanged=onBoneTranslateChanged;
	ap.signals.boneTranslateChanged.add(onBoneTranslateChanged);
}

TranslateControler.prototype.onTransformChanged=function(target){
	var scope=this;
	var ap=this.ap;
	
	if(target!=null && target.userData.transformSelectionType=="BoneTranslate"){
		var root=scope.boneAttachControler.containerList[0];
		
		var bonePos=scope.boneAttachControler.boneList[target.userData.boneIndex].position;
		var diff=target.position.clone().sub(root.position);
		
		bonePos.add(diff);
		scope.boneAttachControler.update();
		
		ap.signals.boneTranslateChanged.dispatch();
	}
}

TranslateControler.prototype.onTransformSelectionChanged=function(target){
	var ap=this.ap;
	if(target!=null && target.userData.transformSelectionType=="BoneTranslate"){
		ap.transformControls.setMode( "translate" );
		ap.transformControls.attach(target);
		//target.quaternion.copy(target.parent.quaternion);
		//target.position.set(0,0,0);
	}
}

TranslateControler.prototype.onTransformStarted=function(target){
	var ap=this.ap;
	if(target!=null && target.userData.transformSelectionType=="BoneTranslate"){
		ap.signals.boneTranslateChanged.remove(this.onBoneTranslateChanged);
	}
}

TranslateControler.prototype.onTransformFinished=function(target){
	var ap=this.ap;
	if(target!=null && target.userData.transformSelectionType=="BoneTranslate"){
		ap.ikControler.resetAllIkTargets();
		
		ap.signals.boneTranslateChanged.add(this.onBoneTranslateChanged);
	}
}