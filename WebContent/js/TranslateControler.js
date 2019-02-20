var TranslateControler=function(ap,boneAttachControler){
	var scope=this;
	this.ap=ap;//TODO remove
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
	sphere.name="trans-c-"+"root";
	sphere.renderOrder=1;
	sphere.position.copy(root.position);
	ap.scene.add(sphere);
	sphere.userData.boneIndex=0;
	sphere.userData.transformSelectionType="BoneTranslate";
	ap.objects.push(sphere);
	//temporary
	scope._sphere=sphere;
	
	this.translateControls["root"]=sphere;
	
	function resetPosition(){
		scope.boneAttachControler.update();
		sphere.position.copy(root.position);
	}
	
	function onBoneTranslateChanged(){
		resetPosition();
		
	}
	scope.onBoneTranslateChanged=onBoneTranslateChanged;
	ap.getSignal("boneTranslateChanged").add(onBoneTranslateChanged);
	
	
	function onPoseChanged(){
		scope.updatePosition();
	}
	
	scope.onPoseChanged=onPoseChanged;
	
	ap.getSignal("poseChanged").add(onPoseChanged);
}


TranslateControler.prototype.setEnabled=function(v){
	this._enabled=v;
	this.setVisible(v);
}
TranslateControler.prototype.setVisible=function(v){
	Object.values(this.translateControls).forEach(function(object){
		object.material.visible=v;
	});
}
TranslateControler.prototype.dispose=function(){
	var ap=this.ap;
	var scope=this;
	
	ap.getSignal("boneTranslateChanged").remove(scope.onBoneTranslateChanged);
	ap.getSignal("poseChanged").remove(scope.onPoseChanged);
	
	var objects=Object.values(this.translateControls);
	objects.forEach(function(object){
		object.parent.remove(object);
	});
	ap.objects=AppUtils.removeAllFromArray(ap.objects,objects);
};

TranslateControler.prototype.updatePosition=function(){
	this.boneAttachControler.update();
	var root=this.boneAttachControler.containerList[0];
	//translate
	this._sphere.position.copy(root.position);
}

TranslateControler.prototype.onTransformChanged=function(target){
	var scope=this;
	var ap=this.ap;
	//for Bone Translate ,not mesh translate
	if(target!=null && target.userData.transformSelectionType=="BoneTranslate"){
		var root=scope.boneAttachControler.containerList[0];
		
		var diff=target.position.clone().sub(root.position);
		//AppUtils.printVec(diff,"before");
		var q=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().getInverse(root.matrixWorld));
		diff.applyQuaternion(q);
		//AppUtils.printVec(diff,"after");
		
		var bonePos=scope.boneAttachControler.boneList[target.userData.boneIndex].position;
		bonePos.add(diff.divide(this.boneAttachControler.skinnedMesh.scale));
		scope.boneAttachControler.update();
		
		ap.signals.boneTranslateChanged.dispatch(target.userData.boneIndex);
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
		ap.signals.boneTranslateChanged.add(this.onBoneTranslateChanged);//not catch myself
		if(ap.signals.boneTranslateFinished){
			ap.signals.boneTranslateFinished.dispatch(target.userData.boneIndex);
		}
	}
}