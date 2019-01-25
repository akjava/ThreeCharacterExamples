var ObjectTransformControler=function(ap){
	this.ap=ap;
	this.helper=null;
	

}

ObjectTransformControler.prototype.onTransformSelectionChanged=function(target){
	var ap=this.ap;
	if(target!=null && target.userData.transformSelectionType=="ObjectTransform"){
		if(target.userData.transformMode=="ObjectTranslate"){
			ap.transformControls.setMode( "rotate" );
			target.userData.transformMode="ObjectRotate"
		}else{
			ap.transformControls.setMode( "translate" );
			target.userData.transformMode="ObjectTranslate"
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
		ap.signals.poseChanged.dispatch();
		if(this.helper!=null){
			this.helper.update();
		}
	}
}