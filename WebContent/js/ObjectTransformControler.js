var ObjectTransformControler=function(ap){
	this.ap=ap;
	this.helper=null;
	var scope=this;
	
	
	function onMeshTransformed(){
		if(scope.helper!=null){
			scope.helper.update();
		}
		//TODO switch signal?
		if(ap.boneAttachControler){
			ap.boneAttachControler.update(true);	
		}
		
		if(ap.ikControler){
			ap.ikControler.resetAllIkTargets();
		}
		
		if(ap.translateControler){
			ap.translateControler.updatePosition();
		}
	}
	
	this.onMeshTransformed=onMeshTransformed;
	ap.getSignal("meshTransformed").add(onMeshTransformed);
}

ObjectTransformControler.prototype.dispose=function(){
	var ap=this.ap;
	ap.getSignal("meshTransformed").remove(this.onMeshTransformed);
};


ObjectTransformControler.prototype.onTransformSelectionChanged=function(target){
	
	var ap=this.ap;
	if(target!=null && target.userData.transformSelectionType=="ObjectTransform"){
		if(target.userData.transformMode=="translate"){
			ap.transformControls.setMode( "translate" );
		}else{
			ap.transformControls.setMode( "rotate" );
		}
		
		ap.transformControls.attach(target);
		if(this.helper==null){
			this.helper=new THREE.BoxHelper(target);
			ap.scene.add(this.helper);
		}
		
		if(this.helper!=null){
			this.helper.material.visible=true;
			this.helper.update();
		}
		
		
	}else{
		if(this.helper!=null){
			this.helper.material.visible=false;
		}
	}
}
ObjectTransformControler.prototype.onTransformStarted=function(target){
	var ap=this.ap;
	if(target!=null && target.userData.transformSelectionType=="ObjectTransform"){
	
		
	}
}

ObjectTransformControler.prototype.onTransformChanged=function(target){
	if(target!=null && target.userData.transformSelectionType=="ObjectTransform"){
		this.ap.getSignal("meshTransformed").dispatch(target.userData.transformMode);
	}
}

ObjectTransformControler.prototype.onTransformFinished=function(target){
	var ap=this.ap;
	if(target!=null && target.userData.transformSelectionType=="ObjectTransform"){
		//ap.signals.poseChanged.dispatch();
		
		//ap.signals.meshTransformed.dispatch(target.userData.transformMode);
		
		ap.getSignal("meshTransformeFinished").dispatch(target.userData.transformMode);
		
		
		if(this.helper!=null){
			this.helper.update();
		}
	}
}