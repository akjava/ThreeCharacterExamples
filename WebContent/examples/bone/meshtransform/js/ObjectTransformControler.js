var ObjectTransformControler=function(ap){
	this.ap=ap;
	this.helper=null;
	var scope=this;
	ap.signals.skinnedMeshTransformed.add(function(){
		if(scope.helper!=null){
			scope.helper.update();
		}
		ap.signals.poseChanged.dispatch();
	});
}

ObjectTransformControler.prototype.onTransformSelectionChanged=function(target){
	var ap=this.ap;
	if(target!=null && target.userData.transformSelectionType=="ObjectTransform"){
		if(target.userData.transformMode=="ObjectTranslate"){
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

ObjectTransformControler.prototype.onTransformFinished=function(target){
	var ap=this.ap;
	if(target!=null && target.userData.transformSelectionType=="ObjectTransform"){
		//ap.signals.poseChanged.dispatch();
		
		ap.signals.skinnedMeshTransformed.dispatch(target);
		
		if(ap.signals.skinnedMeshTransformeFinished){
			ap.signals.skinnedMeshTransformeFinished.dispatch(target);
		}
		
		
		if(this.helper!=null){
			this.helper.update();
		}
	}
}